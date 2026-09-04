"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  INITIAL_MEETINGS,
  MOCK_USERS,
  Meeting,
  MeetingAttachment,
  MeetingAttendee,
  MeetingStatus,
  OfficeNote,
  User,
  AttendanceStatus,
} from "./mock-data";
import { toRoman } from "./utils";

interface MeetingContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  meetings: Meeting[];
  getMeetingById: (id: string) => Meeting | undefined;
  createMeeting: (
    meetingData: Omit<
      Meeting,
      "id" | "createdAt" | "updatedAt" | "attachments" | "auditLogs" | "officeNote"
    >,
    isPublishNow?: boolean
  ) => Meeting;
  updateMeeting: (id: string, meetingData: Partial<Meeting>) => void;
  updateMeetingStatus: (
    meetingId: string,
    statusBaru: MeetingStatus,
    deskripsiAksi?: string
  ) => void;
  saveAttendance: (
    meetingId: string,
    records: { attendeeId: string; kehadiran: AttendanceStatus }[]
  ) => void;
  closeMeetingAndGenerateNote: (
    meetingId: string,
    ringkasanHasil: string
  ) => OfficeNote | null;
  updateOfficeNote: (
    noteId: string,
    data: { isiDraft?: string; isiFinal?: string; status?: "DRAFT" | "FINAL"; perihal?: string }
  ) => void;
  addAttachment: (
    meetingId: string,
    file: {
      namaFileAsli: string;
      mimeType: string;
      ukuranByte: number;
      storageType?: "BUNNY_STORAGE" | "BUNNY_STREAM";
    }
  ) => void;
  deleteAttachment: (meetingId: string, attachmentId: string) => void;
  toggleUserRole: (userId: string) => void;
  toggleUserActive: (userId: string) => void;
  resetToDefaultData: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

const STORAGE_KEY_MEETINGS = "rapatkita_meetings_v1";
const STORAGE_KEY_USERS = "rapatkita_users_v1";
const STORAGE_KEY_ACTIVE_USER = "rapatkita_active_user_v1";

export function MeetingProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      const storedMeetings = localStorage.getItem(STORAGE_KEY_MEETINGS);
      const storedActiveUser = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);

      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        setUsers(parsed);
      }
      if (storedMeetings) {
        const parsed = JSON.parse(storedMeetings);
        setMeetings(parsed);
      }
      if (storedActiveUser) {
        const parsed = JSON.parse(storedActiveUser);
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error("Gagal memuat data dari localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
    }
  }, [users, meetings, currentUser, isLoaded]);

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
    }
  };

  const getMeetingById = (id: string) => {
    return meetings.find((m) => m.id === id);
  };

  const createMeeting = (
    data: Omit<
      Meeting,
      "id" | "createdAt" | "updatedAt" | "attachments" | "auditLogs" | "officeNote"
    >,
    isPublishNow = false
  ): Meeting => {
    const newId = `meet-${Date.now()}`;
    const now = new Date().toISOString();
    const status: MeetingStatus = isPublishNow ? "OPEN" : "DRAFT";

    const newMeeting: Meeting = {
      ...data,
      id: newId,
      status,
      createdById: currentUser.id,
      createdAt: now,
      updatedAt: now,
      attachments: [],
      auditLogs: [
        {
          id: `log-${Date.now()}-1`,
          meetingId: newId,
          actorId: currentUser.id,
          actorName: currentUser.nama,
          aksi: "PEMBUATAN_DRAF",
          statusLama: "DRAFT",
          statusBaru: "DRAFT",
          deskripsi: "Rapat dibuat oleh Admin Pengelola Yayasan",
          createdAt: now,
        },
        ...(isPublishNow
          ? [
              {
                id: `log-${Date.now()}-2`,
                meetingId: newId,
                actorId: currentUser.id,
                actorName: currentUser.nama,
                aksi: "PUBLIKASI",
                statusLama: "DRAFT",
                statusBaru: "OPEN",
                deskripsi: "Rapat langsung dipublikasikan",
                createdAt: now,
              },
            ]
          : []),
      ],
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    return newMeeting;
  };

  const updateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...meetingData,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
  };

  const updateMeetingStatus = (
    meetingId: string,
    statusBaru: MeetingStatus,
    deskripsiAksi?: string
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        const now = new Date().toISOString();
        const statusLama = m.status;

        let aksiName = "PERUBAHAN_STATUS";
        if (statusBaru === "OPEN") aksiName = "PUBLIKASI";
        if (statusBaru === "ONGOING") aksiName = "MULAI_RAPAT";
        if (statusBaru === "COMPLETED") aksiName = "PENUTUPAN";

        const newLog = {
          id: `log-${Date.now()}`,
          meetingId,
          actorId: currentUser.id,
          actorName: currentUser.nama,
          aksi: aksiName,
          statusLama,
          statusBaru,
          deskripsi:
            deskripsiAksi ||
            `Status rapat diubah dari ${statusLama} menjadi ${statusBaru}`,
          createdAt: now,
        };

        return {
          ...m,
          status: statusBaru,
          updatedAt: now,
          auditLogs: [...m.auditLogs, newLog],
        };
      })
    );
  };

  const saveAttendance = (
    meetingId: string,
    records: { attendeeId: string; kehadiran: AttendanceStatus }[]
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        const updatedAttendees = m.attendees.map((att) => {
          const rec = records.find((r) => r.attendeeId === att.id);
          if (rec) {
            return { ...att, kehadiran: rec.kehadiran };
          }
          return att;
        });

        return {
          ...m,
          attendees: updatedAttendees,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const closeMeetingAndGenerateNote = (
    meetingId: string,
    ringkasanHasil: string
  ): OfficeNote | null => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return null;

    const now = new Date();
    const isoNow = now.toISOString();
    const romanMonth = toRoman(now.getMonth() + 1);
    const year = now.getFullYear();

    // Generate Nomor Surat: ND/00X/YAW-9/ROMAN/YEAR
    const countCompleted = meetings.filter((m) => m.officeNote).length + 1;
    const padded = String(countCompleted).padStart(3, "0");
    const nomorSurat = `ND/${padded}/YAW-9/${romanMonth}/${year}`;

    // Auto-generate initial draft text
    const attendeeListFormatted = meeting.attendees
      .map((att, i) => {
        const u = users.find((usr) => usr.id === att.userId);
        const statusText =
          att.kehadiran === "HADIR"
            ? "Hadir"
            : att.kehadiran === "IZIN"
            ? "Izin"
            : att.kehadiran === "TIDAK_HADIR"
            ? "Tidak Hadir"
            : "Belum Tercatat";
        return `<li>${i + 1}. ${u?.nama || "Peserta"} (${att.peran.replace(
          "_",
          " "
        )}) — <em>${statusText}</em></li>`;
      })
      .join("");

    const initialDraft = `
<h2>NOTULEN & HASIL KEPUTUSAN RAPAT</h2>
<p>Pada hari ini, diselenggarakan <strong>${meeting.judul}</strong> bertempat di <strong>${
      meeting.tempat || "Ruang Rapat Virtual"
    }</strong>.</p>

<h3>I. Daftar Kehadiran:</h3>
<ul>
  ${attendeeListFormatted}
</ul>

<h3>II. Hasil Musyawarah & Risalah:</h3>
<p>${ringkasanHasil.replace(/\n/g, "<br/>")}</p>

<h3>III. Penutup:</h3>
<p>Demikian nota dinas dan risalah hasil rapat ini dibuat secara resmi untuk menjadi pedoman pelaksanaan tugas dan arsip Yayasan Al Wathoniyah Asshodriyah 9.</p>
`.trim();

    const noteId = `note-${Date.now()}`;
    const newNote: OfficeNote = {
      id: noteId,
      meetingId,
      nomorSurat,
      perihal: meeting.judul,
      isiDraft: initialDraft,
      status: "DRAFT",
      createdById: currentUser.id,
      createdAt: isoNow,
      updatedAt: isoNow,
    };

    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          status: "COMPLETED",
          ringkasanHasil,
          officeNote: newNote,
          updatedAt: isoNow,
          auditLogs: [
            ...m.auditLogs,
            {
              id: `log-${Date.now()}`,
              meetingId,
              actorId: currentUser.id,
              actorName: currentUser.nama,
              aksi: "PENUTUPAN",
              statusLama: m.status,
              statusBaru: "COMPLETED",
              deskripsi: `Rapat ditutup oleh Admin Pengelola. Draf Nota Dinas ${nomorSurat} dibuat secara otomatis.`,
              createdAt: isoNow,
            },
          ],
        };
      })
    );

    return newNote;
  };

  const updateOfficeNote = (
    noteId: string,
    data: {
      isiDraft?: string;
      isiFinal?: string;
      status?: "DRAFT" | "FINAL";
      perihal?: string;
    }
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.officeNote?.id !== noteId) return m;
        const now = new Date().toISOString();
        const updatedNote: OfficeNote = {
          ...m.officeNote,
          ...data,
          updatedAt: now,
        };

        // If finalized, set isiFinal
        if (data.status === "FINAL" && !updatedNote.isiFinal) {
          updatedNote.isiFinal = data.isiDraft || m.officeNote.isiDraft;
        }

        return {
          ...m,
          officeNote: updatedNote,
          updatedAt: now,
        };
      })
    );
  };

  const addAttachment = (
    meetingId: string,
    file: {
      namaFileAsli: string;
      mimeType: string;
      ukuranByte: number;
      storageType?: "BUNNY_STORAGE" | "BUNNY_STREAM";
    }
  ) => {
    const newAttachment: MeetingAttachment = {
      id: `attc-${Date.now()}`,
      meetingId,
      uploadedById: currentUser.id,
      uploadedByName: currentUser.nama,
      namaFileAsli: file.namaFileAsli,
      urlBerkas: "#",
      mimeType: file.mimeType,
      ukuranByte: file.ukuranByte,
      storageType: file.storageType || "BUNNY_STORAGE",
      createdAt: new Date().toISOString(),
    };

    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          attachments: [newAttachment, ...m.attachments],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteAttachment = (meetingId: string, attachmentId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          attachments: m.attachments.filter((a) => a.id !== attachmentId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const toggleUserRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newRole = u.globalRole === "ADMIN" ? "USER" : "ADMIN";
        return { ...u, globalRole: newRole };
      })
    );
  };

  const toggleUserActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, isActive: !u.isActive };
      })
    );
  };

  const resetToDefaultData = () => {
    setMeetings(INITIAL_MEETINGS);
    setUsers(MOCK_USERS);
    setCurrentUser(MOCK_USERS[0]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_MEETINGS);
      localStorage.removeItem(STORAGE_KEY_USERS);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    }
  };

  return (
    <MeetingContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        users,
        meetings,
        getMeetingById,
        createMeeting,
        updateMeeting,
        updateMeetingStatus,
        saveAttendance,
        closeMeetingAndGenerateNote,
        updateOfficeNote,
        addAttachment,
        deleteAttachment,
        toggleUserRole,
        toggleUserActive,
        resetToDefaultData,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
}
