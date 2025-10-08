import AppView from "./AppView";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const data = await fetch("https://workshop2526.alwaysdata.net/api/apps").then((res) => res.json());
 
  return data.apps.map((app) => ({
    appId: `${app.id}`,
  }))
}
 
// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
  const { appId } = await params;  
  
  return (
    <AppView id={appId} />
  );
}
