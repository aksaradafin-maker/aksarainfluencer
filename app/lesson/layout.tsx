import "./lesson.css";
import "../components/site-header.css";
import SiteHeader from "../components/SiteHeader";

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}