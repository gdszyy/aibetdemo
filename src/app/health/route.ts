export async function GET() {
    return new Response(process.env.GIT_COMMIT_ID || 'unknown');
}
