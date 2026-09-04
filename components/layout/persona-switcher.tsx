"use client";

import React, { useState } from "react";
import { useMeeting } from "@/lib/meeting-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCheck, RefreshCw, ChevronDown, Shield, User as UserIcon } from "lucide-react";

export function PersonaSwitcher() {
  const { currentUser, setCurrentUser, users, resetToDefaultData } = useMeeting();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="no-print">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 transition-all text-left group"
          >
            <Avatar className="h-7 w-7 border border-primary/30">
              <AvatarFallback className="bg-primary text-white text-[11px] font-bold">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[140px]">
                  {currentUser.nama}
                </span>
                <Badge
                  variant={currentUser.globalRole === "ADMIN" ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0 h-4 font-bold uppercase"
                >
                  {currentUser.globalRole === "ADMIN" ? "Admin" : "Anggota"}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {currentUser.jabatan}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72 p-2">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>Simulasi Akun Pengguna</span>
            <Badge variant="outline" className="text-[10px]">
              Tahap 1 Demo
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="space-y-1">
            {users.map((user) => {
              const isActive = user.id === currentUser.id;
              return (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    isActive ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={
                          user.globalRole === "ADMIN"
                            ? "bg-primary text-white text-xs font-bold"
                            : "bg-muted text-foreground text-xs"
                        }
                      >
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {user.nama}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user.jabatan}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {user.globalRole === "ADMIN" ? (
                      <Shield className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {isActive && <UserCheck className="h-4 w-4 text-primary ml-1" />}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={() => {
              if (
                confirm(
                  "Apakah Anda yakin ingin mengatur ulang semua data simulasi rapat ke kondisi awal?"
                )
              ) {
                resetToDefaultData();
              }
            }}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-2 px-2 py-1.5 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Data Simulasi Awal</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
