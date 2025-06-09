import { trpc } from "@/utils/trpc";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";

const HomePage: NextPageWithLayout = () => {
  return (
    <div>hello</div>
  )
}


HomePage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default HomePage

