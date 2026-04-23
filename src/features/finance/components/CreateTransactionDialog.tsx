"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTransaction } from "@/features/finance/actions"
import { Plus } from "lucide-react"

export function CreateTransactionDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<"income" | "expense">("expense")

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await createTransaction(formData)
    setLoading(false)
    if (result?.success) {
      setOpen(false)
    } else {
      alert(result?.error || "Có lỗi xảy ra")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" /> Giao dịch mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch</DialogTitle>
          <DialogDescription>
            Ghi chép lại các khoản thu chi của bạn.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="type">Loại</Label>
                 <Select name="type" value={type} onValueChange={(val: any) => setType(val)}>
                   <SelectTrigger>
                     <SelectValue placeholder="Chọn" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="expense">Chi phí</SelectItem>
                     <SelectItem value="income">Thu nhập</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="amount">Số tiền</Label>
                 <Input id="amount" name="amount" type="number" placeholder="50000" min="0" required />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="category">Danh mục</Label>
                 <Input id="category" name="category" placeholder={type === "expense" ? "Ăn uống, Mua sắm..." : "Lương, Thưởng..."} required />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="date">Ngày</Label>
                 <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
               </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Ghi chú</Label>
              <Textarea id="description" name="description" placeholder="Chi tiết giao dịch..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu giao dịch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}