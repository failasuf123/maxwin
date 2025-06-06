"use client";

import { useState } from "react";
import { db } from "@/app/service/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IconPicker from "./_components/IconPicker";
import ColorPicker from "./_components/ColorPicker";

interface BucketListFormProps {
  userId: string;
}

export default function BucketListForm({ userId }: BucketListFormProps) {
  const [formData, setFormData] = useState({
    namaBucketList: "",
    icon: "",
    color: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) return alert("User ID tidak ditemukan");

    const bucketRef = collection(db, "Users", userId, "BucketList");
    await addDoc(bucketRef, {
      id: Date.now().toString(),
      ...formData,
    });

    setFormData({ namaBucketList: "", icon: "", color: "" });
    alert("Bucket list berhasil ditambahkan!");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">+ Tambah Bucket List</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <Input
            name="namaBucketList"
            placeholder="Nama Bucket List"
            value={formData.namaBucketList}
            onChange={handleChange}
          />

          <div>
            <p className="text-sm text-muted-foreground mb-1">Pilih Icon</p>
            <IconPicker
              selected={formData.icon}
              onSelect={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Pilih Warna</p>
            <ColorPicker
              selected={formData.color}
              onSelect={(color) => setFormData((prev) => ({ ...prev, color }))}
            />
          </div>

          <Button onClick={handleSubmit}>Simpan</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
