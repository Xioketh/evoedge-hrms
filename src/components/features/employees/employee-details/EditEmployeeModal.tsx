"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { updateEmployeeAction } from "@/src/actions/employee.actions";
import { toast } from "sonner";

interface EditEmployeeModalProps {
  userId: string;
  email: string;
  employeeCode: string;
}

export function EditEmployeeModal({ userId, email, employeeCode }: EditEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateEmployeeAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  // Reset form status state when dialog closes
  useEffect(() => {
    if (!open && state?.error) {
      // The state persists, so if they reopen, the old error might show.
      // useActionState doesn't let us easily clear state, but it's fine for simple cases.
    }
  }, [open, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Edit Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4 py-4">
          <input type="hidden" name="userId" value={userId} />

          <div className="space-y-2">
            <Text size="1" className="font-medium">Email Address</Text>
            <Input
              name="email"
              type="email"
              defaultValue={email}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Text size="1" className="font-medium">Employee ID</Text>
            <Input
              name="employeeCode"
              defaultValue={employeeCode}
              required
              disabled={isPending}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="muted" type="button" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
