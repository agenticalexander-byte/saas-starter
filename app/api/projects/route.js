import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/projects — returns only the logged-in user's projects
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

// POST /api/projects — creates a project owned by the logged-in user
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    return Response.json({ error: "A project name is required." }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        userId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
      },
    });
    return Response.json(project, { status: 201 });
  } catch (err) {
    console.error("Create error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
