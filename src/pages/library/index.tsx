import { ReactElement } from "react"
import { NextPageWithLayout } from "../_app"
import HomeLayout from "@/components/layouts/HomeLayout"
import RightSideBar from "@/components/shared/RightSideBar"

const LibraryPage: NextPageWithLayout = () => {
  return (
    <RightSideBar>
      library page
    </RightSideBar>
  )
}

LibraryPage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default LibraryPage
