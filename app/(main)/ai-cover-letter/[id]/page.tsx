import React from "react";

interface Props {
  params: any;
}

async function Page(props: Props) {
  const { params } = props;
  const id = await params.id;
  console.log(id);
  return <p>id:{id} </p>;
}

export default Page;
