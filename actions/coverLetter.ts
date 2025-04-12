"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";



let model:any;

if(process.env.GEMINI_API_KEY){
  const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  model=genAI.getGenerativeModel({
      model:"gemini-1.5-flash"
  })
}

interface CoverLetterProp{
  content:any,
  jobTitle:string,
  jobDescription:string
}
const saveCoverLetter=async(contentRes:CoverLetterProp)=>{
  const {userId}=await auth();
  const {content,jobTitle,jobDescription}=contentRes;
  if(!userId) throw new Error("User Unauthorized");

  const user=await db.user.findUnique({
    where:{
      clerkUserId:userId
    }
  })
  if(!user) throw new Error("User not Found");

  try {
    const coverLetter=await db.coverLetter.upsert({
      where:{
        id:user.id
      },
      update:{
        content
      },
      create:{
        userId:user.id,
        jobTitle,
        jobDescription,
        content
      }
    })
    revalidatePath("/coverLetter");
    return coverLetter;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save coverLetter");
  }
}

export const getCoverLetter=async()=>{
  const {userId}=await auth();
  if(!userId) throw new Error("Unauthorized User");

  const user=await db.user.findUnique({
    where:{
      clerkUserId:userId
    }
  })
  if(!user) throw new Error("User Not Found");
  return await db.coverLetter.findUnique({
    where:{
      id: user.id
    }
  })

}

interface props{
  type:string,
  current:string
}
export async function improveWithAICoverLetter(content:props) {
  const {type,current}=content;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");
  console.log(type);
  const prompt = `
    As an expert Cover Letter writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

export const analyzeCoverLetter=async(content:string)=>{
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!user) throw new Error("User not found")
      console.log(content)
      const prompt = `
        As an expert Cover Letter reviewer, analyze the following Cover Letter for a ${user.industry} professional.
        Provide a comprehensive analysis with scores and feedback.
        
        Cover Letter content:
        ${content}
        
        Return the analysis in this JSON format only:
        {
          "overall": number, // 0-100 score
          "sections": [
            {
              "name": string, // e.g., "Summary", "Experience", "Skills", etc.
              "score": number, // 0-100 score
              "feedback": string // Specific feedback for this section
            }
          ],
          "suggestions": [
            {
              "id": string, // Unique ID
              "type": string, // "summary", "skills", "experience", etc.
              "section": string, // Human-readable section name
              "content": string, // Suggested content
              "reason": string, // Reason for the suggestion
              "index": number // Optional: index for array items like experience entries
            }
          ]
        }
        
        Provide at least 3-5 specific suggestions for improvement. Focus on content, not formatting.
      `

      try {
        const result = await model.generateContent(prompt)
        const response = result.response
        let analysisText = response.text().trim()
        if (analysisText.startsWith("```json") || analysisText.startsWith("```")) {
          analysisText = analysisText.replace(/```json|```/g, "").trim()
        }
        return JSON.parse(analysisText)
        
        
      } catch (error) {
        console.error("Error analyzing Cover Letter:", error)
        throw new Error("Failed to analyze Cover Letter")
      }
    }
  
interface TailorProps {
  coverLetterContent: string
  jobDescription: string
}

export async function tailorToJobCoverLetter(data: TailorProps) {
  const { coverLetterContent, jobDescription } = data
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!user) throw new Error("User not found")


      const prompt = `
        As an expert Cover Letter writer, tailor the following Cover Letter to match the provided job description.
        Identify key skills and requirements from the job description and modify the cover letter to highlight relevant experience.
        
        Cover Letter content:
        ${coverLetterContent}
        
        Job Description:
        ${coverLetterContent}
        
        Return only the modified sections in this JSON format:
        {
          "summary": string, // Modified summary
          "skills": string, // Modified skills
          "experience": [
            {
              "index": number, // Index of the experience entry (0-based)
              "description": string // Modified description
            }
          ]
        }
        
        Focus on highlighting relevant experience and incorporating keywords from the job description.
        Do not include sections that don't need modification.
      `

      try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const tailoredContent = response.text().trim()
        return JSON.parse(tailoredContent)
      } catch (error) {
        console.error("Error tailoring Cover Letter:", error)
        throw new Error("Failed to tailor Cover Letter")
      }
    }
