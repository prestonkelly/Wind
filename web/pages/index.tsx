import { useSelector } from "react-redux"
import { useRouter } from "next/router"

export default function Index() {
  const router = useRouter()
  const auth = useSelector((state: any) => state.userInfo.authorized)

  if (!auth) {
    router.push("/login")
  } else {
    router.push("/home")
  }
  return null
}
