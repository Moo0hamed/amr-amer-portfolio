import { cookies } from "next/headers";
import OwnerContentStudio from "../../components/owner-content-studio";
import { sessionCookieName, verifyOwnerSession } from "../../lib/auth";

export const metadata = {
  title: "Owner Studio"
};

export default async function StudioPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName())?.value;
  const authenticated = verifyOwnerSession(session);
  return <OwnerContentStudio authenticated={authenticated} />;
}
