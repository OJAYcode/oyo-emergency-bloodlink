import Link from "next/link";
export default function NotFound(){return <main className="login-wrap"><section className="login-card"><h1>Request not found</h1><p>This sample request may have been removed or the link is incorrect.</p><Link href="/dashboard" className="btn" style={{marginTop:20}}>Return to dashboard</Link></section></main>}
