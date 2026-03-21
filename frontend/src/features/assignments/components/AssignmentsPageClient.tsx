"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AssignmentsContent from "./AssignmentsContent";
import type { Assignment } from "../types";
import { createRealtimeSocket, deleteAssignment, listAssignments } from "@/services/backendApi";

function mapAssignment(item: Awaited<ReturnType<typeof listAssignments>>[number]): Assignment {
  return {
    id: item._id,
    title: item.title,
    createdAt: item.createdAt,
    status: item.status,
  };
}

export default function AssignmentsPageClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    try {
      setError(null);
      const result = await listAssignments();
      setAssignments(result.map(mapAssignment));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load assignments";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    let mounted = true;

    const initSocket = async () => {
      try {
        const socket = await createRealtimeSocket();

        const onUpdate = () => {
          if (!mounted) return;
          void loadAssignments();
        };

        socket.on("assignment.status.updated", onUpdate);
        socket.on("assignment.generation.progress", onUpdate);
        socket.on("assignment.pdf.ready", onUpdate);
        socket.on("assignment.failed", onUpdate);

        return () => {
          socket.off("assignment.status.updated", onUpdate);
          socket.off("assignment.generation.progress", onUpdate);
          socket.off("assignment.pdf.ready", onUpdate);
          socket.off("assignment.failed", onUpdate);
          socket.disconnect();
        };
      } catch {
        return () => undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    void initSocket().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [loadAssignments]);

  const sortedAssignments = useMemo(
    () => [...assignments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [assignments],
  );

  const handleDelete = useCallback(
    async (assignmentId: string) => {
      await deleteAssignment(assignmentId);
      await loadAssignments();
    },
    [loadAssignments],
  );

  return (
    <AssignmentsContent
      assignments={sortedAssignments}
      isLoading={isLoading}
      errorMessage={error}
      onRetry={() => void loadAssignments()}
      onDelete={handleDelete}
    />
  );
}
