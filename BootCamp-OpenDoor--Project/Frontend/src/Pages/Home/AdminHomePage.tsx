import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getAllUsers, rejectUser, verifyUser } from "@/services/auth/authService";
import type { UserData } from "@/types/types";
import { Check, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmationModal } from "@/components/MyComponents/ui/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AdminHomePage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<"verify" | "reject" | null>(null);
  const {user} = useAuth()

  useEffect(() => {
    fetchUsers();
  },[])

  const fetchUsers = async() => {
    try{
        if (!user.token) {
        setLoading(false);
        return;
      }
      const data = await getAllUsers(user.token);
      setUsers(data);
    }catch(e){
      toast.error("Failed to fetch users.");
    }finally{
      setLoading(false);
    }
  }

  const handleOpenConfirm = (id: number, action: "verify" | "reject") => {
    setSelectedUserId(id);
    setSelectedAction(action);
    setOpenConfirm(true);
  };

  const handleAction = async () => {
    try {
      setLoading(true);

      if (!user.token || !selectedUserId || !selectedAction) {
        setLoading(false);
        return;
      }

      if (selectedAction === "verify") {
        await verifyUser(user.token, selectedUserId);
      } else {
        await rejectUser(user.token, selectedUserId);
      }

      setOpenConfirm(false);
      setSelectedUserId(null);
      setSelectedAction(null);

      await fetchUsers();
    } catch (e) {
      toast.error("Failed to change user status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="mb-4 flex items-center justify-center gap-3 text-2xl font-bold">
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span>Users Management</span>
          </CardTitle>

          <CardDescription className="text-center">
            View hosts, families, and their verification details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border">
              <Table>
                <TableHeader className="bg-sky-50/70 dark:bg-sky-950/30">
                  <TableRow>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Full Name</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Email</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Phone</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Role</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Verification</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Documents</TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">{userItem.full_name}</TableCell>
                      <TableCell>{userItem.email}</TableCell>
                      <TableCell>{userItem.phone_number}</TableCell>
                      <TableCell>{userItem.user_role}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            userItem.verification_status === "Pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                              : userItem.verification_status === "Verified"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : userItem.verification_status === "Rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                          }`}
                        >
                          {userItem.verification_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {userItem.documents_url ? (
                          <a
                            href={userItem.documents_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            View Document
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">No document</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size={"sm"}
                            onClick={() => handleOpenConfirm(userItem.id,"verify")}
                            className="rounded-full bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={userItem.verification_status === "Verified"}
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            size={"sm"}
                            onClick={() => handleOpenConfirm(userItem.id,"reject")}
                            className="rounded-full bg-red-100 p-2 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={userItem.verification_status === "Rejected"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmationModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Change user's staus?"
        description="This action will update the user's verification status."
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={handleAction}
        loading={loading}
      />
    </div>
  );
};