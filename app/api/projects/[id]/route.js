import { prisma } from "@/lib/prisma";

// PATCH /api/projects/:id
// Updates a project. Expects JSON body with any of: { name, status }
// We use PATCH (partial update) rather than PUT (full replace) because the
// frontend only ever sends the one field that changed - e.g. just { status: "done" }
// when you click a "mark done" button, not the whole object back.
export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();

  const data = {};
  if (body.name !== undefined) data.name = body.name.trim();
  if (body.status !== undefined) data.status = body.status;

  try {
    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return Response.json(project);
  } catch (err) {
    // Prisma throws if the id doesn't match any row - turn that into a clean 404
    // instead of letting a raw database error leak back to the client.
    return Response.json({ error: "Project not found." }, { status: 404 });
  }
}

// DELETE /api/projects/:id
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.project.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }
}
