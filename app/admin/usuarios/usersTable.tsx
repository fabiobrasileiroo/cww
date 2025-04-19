"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

type User = {
  image: string | null;
  name: string;
  id: string;
  email: string;
  password: string;
  isWorking: boolean | null;
  role: "USER" | "ADMIN" | "ROOT",
  createdAt: Date;
  updatedAt: Date;

}

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"" | User["role"]>("")
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filtra busca + cargo
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter ? u.role === roleFilter : true
      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  function handleOpenProfile(user: User) {
    setSelectedUser(user)
    setOpenSheet(true)
  }

  function handleDelete() {
    // chame sua API: DELETE /api/users/[id]
    console.log("deletar", selectedUser?.id)
    setOpenDialog(false)
    setOpenSheet(false)
  }

  function handleRoleChange(newRole: User["role"]) {
    if (!selectedUser) return
    // chame sua API: PATCH /api/users/[id] { role: newRole }
    console.log("mudar role", selectedUser.id, newRole)
    setSelectedUser({ ...selectedUser, role: newRole })
  }

  return (
    <main className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Usuários Cadastrados</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {/* <Select onValueChange={(val) => setRoleFilter(val as any)} value={roleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="USER">Usuários</SelectItem>
            <SelectItem value="ADMIN">Administradores</SelectItem>
            <SelectItem value="ROOT">Root</SelectItem>
          </SelectContent>
        </Select> */}
        <Badge variant="outline">
          Total: <span className="font-semibold ml-1">{filtered.length}</span>
        </Badge>
      </div>

      <Card className="rounded-2xl shadow-sm border border-muted">
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isWorking ? (
                      <Badge className="bg-green-500/20 text-green-700 border border-green-500">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-700 border border-red-500">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenProfile(user)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer de perfil */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent  size="lg">
          <SheetHeader>
            <SheetTitle>Perfil de Usuário</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-4">
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-muted-foreground">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-medium">{selectedUser.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {selectedUser.id}
                </p>
                <p>
                  <span className="font-semibold">Criado em:</span>{" "}
                  {new Date(selectedUser.createdAt).toLocaleString("pt-BR")}
                </p>
                <p>
                  <span className="font-semibold">Atualizado em:</span>{" "}
                  {new Date(selectedUser.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="space-y-2">

                <Select
                  value={selectedUser.role}
                  onValueChange={(val) => handleRoleChange(val as User["role"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="ROOT">Root</SelectItem>
                  </SelectContent>
                </Select>




                {/* <Select
                  value={selectedUser.role}
                  onValueChange={(val) => handleRoleChange(val as User["role"])}
                >
                  <SelectTrigger className="w-full">
                  {roles.map((r) => (
  <SelectItem key={r} value={r}>
    {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
  </SelectItem>
))}
{roles.map((r) => (
  <SelectItem key={r} value={r}>
    {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
  </SelectItem>
))}
 */}
              </div>

              <div className="flex gap-2 pt-4">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Deletar usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tem certeza?</DialogTitle>
                      <p>
                        Esta ação é irreversível. Usuário{" "}
                        <strong>{selectedUser.name}</strong> será deletado.
                      </p>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Deletar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="secondary" size="sm" onClick={() => setOpenSheet(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  )
}
