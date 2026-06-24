import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["Name", "Description", "Status", "Created"],
    ...projects.map((p) => [
      p.name,
      p.description ?? "",
      p.status,
      new Date(p.createdAt).toLocaleDateString(),
    ]),
  ];

  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=projects.csv",
    },
  });
}
