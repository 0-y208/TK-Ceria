import { useState } from 'react';
import {
  Calendar,
  UserCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  Download,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Check,
  Loader2,
  FileSpreadsheet,
  FileDown,
  Eye,
  School,
  Users,
  GraduationCap,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { Student, ClassRoom, SchoolProfile, DailyAttendance, AttendanceStatus } from '../../types/paud';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';

interface AttendanceViewProps {
  students: Student[];
  classes: ClassRoom[];
  school: SchoolProfile;
}

export function AttendanceView({ students, classes, school }: AttendanceViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-29');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'harian' | 'rekap'>('harian');
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>(
    StorageService.getAttendanceRecords()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [showOfficialPreview, setShowOfficialPreview] = useState(false);
  const [finishedClassBanner, setFinishedClassBanner] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to get class student count
  const getClassStudentCount = (clsId: string) => {
    return students.filter((s) => s.kelasId === clsId).length;
  };

  // Check if a student has been attended/marked on the selected date
  const isStudentAttended = (studentId: string): boolean => {
    return attendanceRecords.some(
      (r) => r.date === selectedDate && r.studentId === studentId && Boolean(r.status)
    );
  };

  // Filter students based on selected class and search
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClassId === 'ALL' || s.kelasId === selectedClassId;
    const matchSearch =
      s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.namaPanggilan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm);
    return matchClass && matchSearch;
  });

  // Active class object if a single class is chosen
  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Group classes with their students
  const activeClassesToDisplay = selectedClassId === 'ALL'
    ? classes
    : classes.filter((c) => c.id === selectedClassId);

  // Get status for student on selected date
  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const found = attendanceRecords.find(
      (r) => r.date === selectedDate && r.studentId === studentId
    );
    return found ? found.status : 'H';
  };

  const getStudentNote = (studentId: string): string => {
    const found = attendanceRecords.find(
      (r) => r.date === selectedDate && r.studentId === studentId
    );
    return found?.note || '';
  };

  const getStudentTemp = (studentId: string): string => {
    const found = attendanceRecords.find(
      (r) => r.date === selectedDate && r.studentId === studentId
    );
    return found?.temperature || '36.5';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    soundService.playPop();
    const currentNote = getStudentNote(studentId);
    const currentTemp = getStudentTemp(studentId);
    StorageService.setStudentAttendance(selectedDate, studentId, status, currentNote, currentTemp);
    setAttendanceRecords(StorageService.getAttendanceRecords());

    const student = students.find((s) => s.id === studentId);
    const statusMap: Record<AttendanceStatus, string> = { H: 'Hadir', S: 'Sakit', I: 'Izin', A: 'Alfa' };
    const label = statusMap[status] || 'Hadir';
    showToast(`✓ Selesai! Presensi ${student?.namaPanggilan || 'siswa'} tercatat: ${label}`);
  };

  const handleNoteChange = (studentId: string, note: string) => {
    const status = getStudentStatus(studentId);
    const currentTemp = getStudentTemp(studentId);
    StorageService.setStudentAttendance(selectedDate, studentId, status, note, currentTemp);
    setAttendanceRecords(StorageService.getAttendanceRecords());
  };

  const handleTempChange = (studentId: string, temp: string) => {
    const status = getStudentStatus(studentId);
    const currentNote = getStudentNote(studentId);
    StorageService.setStudentAttendance(selectedDate, studentId, status, currentNote, temp);
    setAttendanceRecords(StorageService.getAttendanceRecords());
  };

  // Mark all present in filtered list or specific class
  const handleMarkClassPresent = (clsId?: string) => {
    soundService.playVictory();
    confetti({ particleCount: 45, spread: 60 });
    
    let targetStudents = filteredStudents;
    let label = 'Semua murid';
    if (clsId && clsId !== 'ALL') {
      targetStudents = students.filter((s) => s.kelasId === clsId);
      const c = classes.find((cl) => cl.id === clsId);
      label = `Semua murid di ${c?.namaKelas || 'kelas'}`;
    }

    const studentIds = targetStudents.map((s) => s.id);
    StorageService.markAllPresent(selectedDate, studentIds);
    setAttendanceRecords(StorageService.getAttendanceRecords());
    showToast(`${label} berhasil ditandai HADIR pada tanggal ${selectedDate}!`);
    soundService.speakIndonesian(`${label} berhasil ditandai hadir!`);
  };

  // Explicit Selesai Absen action
  const handleFinishAttendance = (clsId?: string) => {
    soundService.playVictory();
    confetti({ particleCount: 55, spread: 75 });

    const targetClass = classes.find((c) => c.id === clsId);
    const className = targetClass ? targetClass.namaKelas : 'Semua Kelas';

    // Auto-record any unrecorded students in scope as Hadir
    const targetStudents = clsId && clsId !== 'ALL'
      ? students.filter((s) => s.kelasId === clsId)
      : filteredStudents;

    const unrecorded = targetStudents.filter(
      (s) => !attendanceRecords.some((r) => r.date === selectedDate && r.studentId === s.id)
    );

    if (unrecorded.length > 0) {
      StorageService.markAllPresent(selectedDate, unrecorded.map((s) => s.id));
      setAttendanceRecords(StorageService.getAttendanceRecords());
    }

    setFinishedClassBanner(className);
    showToast(`✓ Selesai! Presensi ${className} telah selesai dan tersimpan rapi.`);
    soundService.speakIndonesian(`Presensi ${className} selesai dan berhasil disimpan.`);
  };

  // Sync attendance summary to Rapor
  const handleSyncToRapor = () => {
    soundService.playVictory();
    const assessments = StorageService.getAssessments();
    students.forEach((s) => {
      const summary = StorageService.getStudentAttendanceSummary(s.id);
      const idx = assessments.findIndex((a) => a.studentId === s.id);
      if (idx !== -1) {
        assessments[idx].kehadiranSakit = summary.sakit;
        assessments[idx].kehadiranIzin = summary.izin;
        assessments[idx].kehadiranAlfa = summary.alfa;
      }
    });
    StorageService.saveAssessments(assessments);
    showToast('Rekap absensi berhasil disinkronkan ke lembar rapor seluruh siswa!');
    soundService.speakIndonesian('Data absensi berhasil disinkronkan ke manajemen rapor.');
  };

  // Direct Vector PDF Generator & Downloader using jsPDF
  const handleDownloadPdf = (targetClassId: string = selectedClassId) => {
    try {
      setIsDownloadingPdf(true);
      soundService.playSparkle();

      const isAll = targetClassId === 'ALL';
      const targetClass = classes.find((c) => c.id === targetClassId);
      const targetStudents = isAll
        ? students
        : students.filter((s) => s.kelasId === targetClassId);

      // Create A4 Landscape PDF (297mm x 210mm)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
      const margin = 14;

      // 1. Kop Surat Resmi
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(20, 30, 45);
      doc.text(school.namaSekolah.toUpperCase(), pageWidth / 2, 16, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 80, 95);
      const kopInfo1 = `NPSN: ${school.npsn}  •  Alamat: ${school.alamat}, Kec. ${school.kecamatan}, ${school.kabKota}, Prov. ${school.provinsi}`;
      doc.text(kopInfo1, pageWidth / 2, 21, { align: 'center' });

      const kopInfo2 = `No. HP: ${school.hp}  •  Email: ${school.email}  •  Akreditasi: ${school.akreditasi}`;
      doc.text(kopInfo2, pageWidth / 2, 25.5, { align: 'center' });

      // Double line under Kop Surat
      doc.setDrawColor(30, 40, 55);
      doc.setLineWidth(0.8);
      doc.line(margin, 28, pageWidth - margin, 28);
      doc.setLineWidth(0.2);
      doc.line(margin, 29, pageWidth - margin, 29);

      // 2. Document Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      const docTitle = isAll
        ? 'REKAPITULASI PRESENSI & KEHADIRAN PESERTA DIDIK (SEMUA KELAS)'
        : `REKAPITULASI PRESENSI & KEHADIRAN - ${targetClass?.namaKelas.toUpperCase()}`;
      doc.text(docTitle, pageWidth / 2, 36, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 90, 105);
      const subInfo = `Tahun Ajaran: ${school.tahunAjaran}   |   Semester: ${school.semester}   |   Rombel: ${
        isAll
          ? `Seluruh Rombel (${targetStudents.length} Siswa)`
          : `${targetClass?.kelompokUsia} - Wali Kelas: ${targetClass?.waliKelas}`
      }`;
      doc.text(subInfo, pageWidth / 2, 41, { align: 'center' });

      // 3. Table Headers
      // Total table width = 297 - 28 = 269mm
      const startX = margin;
      let startY = 46;
      const rowHeight = 7.5;
      const colWidths = [10, 26, 65, 45, 20, 20, 20, 20, 23, 20];
      const headers = [
        'No',
        'NISN',
        'Nama Lengkap Siswa',
        'Rombel / Kelas',
        'Hadir',
        'Sakit',
        'Izin',
        'Alfa',
        '% Hadir',
        'Keterangan',
      ];

      // Draw Header Row
      doc.setFillColor(240, 244, 248);
      doc.rect(startX, startY, 269, rowHeight, 'F');
      doc.setDrawColor(80, 90, 105);
      doc.setLineWidth(0.3);
      doc.rect(startX, startY, 269, rowHeight, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      let curX = startX;
      headers.forEach((h, i) => {
        if (i > 0) doc.line(curX, startY, curX, startY + rowHeight);
        const textX = i === 1 || i === 2 ? curX + 2.5 : curX + colWidths[i] / 2;
        const align = i === 1 || i === 2 ? 'left' : 'center';
        doc.text(h, textX, startY + 5.2, { align: align as 'left' | 'center' });
        curX += colWidths[i];
      });

      startY += rowHeight;

      // 4. Draw Student Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);

      targetStudents.forEach((st, idx) => {
        const cls = classes.find((c) => c.id === st.kelasId);
        const summary = StorageService.getStudentAttendanceSummary(st.id);
        const total = summary.hadir + summary.sakit + summary.izin + summary.alfa;
        const pct = total > 0 ? Math.round((summary.hadir / total) * 100) : 100;
        const statusText =
          pct >= 85 ? 'Sangat Rajin' : pct >= 70 ? 'Cukup Rajin' : 'Perlu Bimbingan';

        // Alternate row fill
        if (idx % 2 === 1) {
          doc.setFillColor(250, 252, 255);
          doc.rect(startX, startY, 269, rowHeight, 'F');
        }

        doc.setDrawColor(180, 190, 200);
        doc.setLineWidth(0.2);
        doc.rect(startX, startY, 269, rowHeight, 'S');

        const rowVals = [
          (idx + 1).toString(),
          st.nisn,
          st.namaLengkap,
          cls ? cls.namaKelas : '-',
          `${summary.hadir} hari`,
          `${summary.sakit} hari`,
          `${summary.izin} hari`,
          `${summary.alfa} hari`,
          `${pct}%`,
          statusText,
        ];

        curX = startX;
        rowVals.forEach((val, i) => {
          if (i > 0) doc.line(curX, startY, curX, startY + rowHeight);
          const textX = i === 1 || i === 2 ? curX + 2.5 : curX + colWidths[i] / 2;
          const align = i === 1 || i === 2 ? 'left' : 'center';

          if (i === 2) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
          } else if (i === 4) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(16, 120, 70);
          } else if (i === 8) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 30, 45);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 60, 75);
          }

          doc.text(val, textX, startY + 5.1, { align: align as 'left' | 'center' });
          curX += colWidths[i];
        });

        startY += rowHeight;
      });

      // 5. Total Summary Bar
      startY += 3;
      doc.setFillColor(242, 246, 250);
      doc.rect(startX, startY, 269, 7.5, 'F');
      doc.setDrawColor(160, 175, 190);
      doc.rect(startX, startY, 269, 7.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `TOTAL PESERTA DIDIK TERCATAT: ${targetStudents.length} SISWA`,
        startX + 4,
        startY + 5.2
      );

      // 6. Formal Signatures
      const sigY = Math.max(startY + 15, 145);
      const col1X = margin + 35;
      const col2X = pageWidth - margin - 35;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 70, 85);
      doc.text('Mengetahui,', col1X, sigY, { align: 'center' });
      doc.text(`Kepala ${school.namaSekolah}`, col1X, sigY + 5, { align: 'center' });

      doc.text(`${school.kabKota}, 29 Oktober 2026`, col2X, sigY, { align: 'center' });
      const waliText = targetClass
        ? `Wali Kelas ${targetClass.namaKelas.split(' ')[0]}`
        : 'Wali Kelas / Guru Pendamping';
      doc.text(waliText, col2X, sigY + 5, { align: 'center' });

      // Names & Underlines
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(school.kepalaSekolah, col1X, sigY + 28, { align: 'center' });
      doc.setLineWidth(0.3);
      doc.line(col1X - 32, sigY + 29, col1X + 32, sigY + 29);

      const waliName =
        targetClass?.waliKelas || classes[0]?.waliKelas || 'Sri Wahyuni, S.Pd.AUD';
      doc.text(waliName, col2X, sigY + 28, { align: 'center' });
      doc.line(col2X - 32, sigY + 29, col2X + 32, sigY + 29);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 110, 125);
      doc.text('NIP. - / Pembina TK', col1X, sigY + 33, { align: 'center' });
      doc.text('NIP. - / Guru Pendamping', col2X, sigY + 33, { align: 'center' });

      // Clean file name
      const cleanClass = isAll
        ? 'Semua_Kelas'
        : (targetClass?.namaKelas || 'Kelas').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanSemester = school.semester.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Rekap_Presensi_TK_MASYITHOH_CIMANGGU_${cleanClass}_${cleanSemester}.pdf`;

      // Direct download trigger via Blob
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      }, 1500);

      soundService.playVictory();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setDownloadSuccessMessage(
        `File PDF "${fileName}" berhasil diunduh ke folder Downloads komputermu!`
      );
      soundService.speakIndonesian('Rekap absensi murid berhasil diunduh ke dalam file PDF.');
      setTimeout(() => setDownloadSuccessMessage(null), 6000);
    } catch (err) {
      console.error('PDF generation error, fallback to HTML document:', err);
      handleDownloadHtmlDoc(targetClassId);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Direct CSV / Excel Download
  const handleDownloadCsv = (targetClassId: string = selectedClassId) => {
    soundService.playVictory();
    const isAll = targetClassId === 'ALL';
    const targetStudents = isAll
      ? students
      : students.filter((s) => s.kelasId === targetClassId);

    const headers = [
      'No',
      'NISN',
      'Nama Lengkap',
      'Nama Panggilan',
      'Rombel / Kelas',
      'Hadir (Hari)',
      'Sakit (Hari)',
      'Izin (Hari)',
      'Alfa (Hari)',
      'Total Hari',
      'Persentase Kehadiran (%)',
      'Status Rapor',
    ];

    const rows = targetStudents.map((st, index) => {
      const cls = classes.find((c) => c.id === st.kelasId);
      const summary = StorageService.getStudentAttendanceSummary(st.id);
      const total = summary.hadir + summary.sakit + summary.izin + summary.alfa;
      const pct = total > 0 ? Math.round((summary.hadir / total) * 100) : 100;

      return [
        index + 1,
        `"${st.nisn}"`,
        `"${st.namaLengkap}"`,
        `"${st.namaPanggilan}"`,
        `"${cls?.namaKelas || '-'}"`,
        summary.hadir,
        summary.sakit,
        summary.izin,
        summary.alfa,
        total,
        `${pct}%`,
        '"Tersinkron Rapor"',
      ];
    });

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanClass = isAll ? 'Semua_Kelas' : 'Kelas';
    link.download = `Rekap_Presensi_TK_MASYITHOH_CIMANGGU_${cleanClass}_${school.tahunAjaran.replace('/', '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);

    showToast('File Excel / CSV rekapitulasi absensi berhasil diunduh!');
    soundService.speakIndonesian('File Excel rekapitulasi absensi berhasil diunduh.');
  };

  // Fallback / Standalone HTML Document Download
  const handleDownloadHtmlDoc = (targetClassId: string = selectedClassId) => {
    const isAll = targetClassId === 'ALL';
    const targetStudents = isAll
      ? students
      : students.filter((s) => s.kelasId === targetClassId);
    const targetClass = classes.find((c) => c.id === targetClassId);

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rekap Absensi - ${school.namaSekolah}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 15mm; color: #111; }
    @page { size: A4 landscape; margin: 10mm; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
    th, td { border: 1px solid #333; padding: 6px 8px; text-align: center; }
    th { background: #f0f4f8; }
    .text-left { text-align: left; }
    .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 12px; }
    .title { text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 4px; }
    .sig-table { width: 100%; margin-top: 30px; border: none; }
    .sig-table td { border: none; text-align: center; }
  </style>
</head>
<body>
  <div class="kop">
    <h2 style="margin:0; text-transform:uppercase;">${school.namaSekolah}</h2>
    <p style="margin:4px 0; font-size:11px;">NPSN: ${school.npsn} • Alamat: ${school.alamat}, Kec. ${school.kecamatan}, ${school.kabKota}</p>
    <p style="margin:0; font-size:11px;">Telp: ${school.hp} • Email: ${school.email}</p>
  </div>
  <div class="title">REKAPITULASI PRESENSI & KEHADIRAN PESERTA DIDIK</div>
  <div style="text-align:center; font-size:11px; margin-bottom:12px;">Tahun Ajaran ${school.tahunAjaran} • Semester ${school.semester} • ${isAll ? 'Semua Kelas' : targetClass?.namaKelas}</div>
  <table>
    <thead>
      <tr>
        <th>No</th><th>NISN</th><th>Nama Siswa</th><th>Rombel</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alfa</th><th>% Hadir</th>
      </tr>
    </thead>
    <tbody>
      ${targetStudents
        .map((st, i) => {
          const cls = classes.find((c) => c.id === st.kelasId);
          const sum = StorageService.getStudentAttendanceSummary(st.id);
          const tot = sum.hadir + sum.sakit + sum.izin + sum.alfa;
          const pct = tot > 0 ? Math.round((sum.hadir / tot) * 100) : 100;
          return `<tr>
            <td>${i + 1}</td><td>${st.nisn}</td><td class="text-left font-bold">${st.namaLengkap}</td>
            <td>${cls?.namaKelas || '-'}</td><td>${sum.hadir}</td><td>${sum.sakit}</td><td>${sum.izin}</td><td>${sum.alfa}</td><td>${pct}%</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>
  <table class="sig-table">
    <tr>
      <td style="width:50%;">Mengetahui,<br>Kepala ${school.namaSekolah}<br><br><br><br><b><u>${school.kepalaSekolah}</u></b><br><span style="font-size:10px; color:#64748b;">NIP. - / Pembina TK</span></td>
      <td style="width:50%;">${school.kabKota}, 29 Oktober 2026<br>Guru Kelas / Walikelas<br><br><br><br><b><u>${targetClass?.waliKelas || 'Wali Kelas'}</u></b><br><span style="font-size:10px; color:#64748b;">NIP. - / Guru Pendamping</span></td>
    </tr>
  </table>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dokumen_Rekap_Presensi_${school.tahunAjaran.replace('/', '-')}.html`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  // Calculate day metrics
  const dayRecords = filteredStudents.map((s) => getStudentStatus(s.id));
  const totalHadir = dayRecords.filter((st) => st === 'H').length;
  const totalSakit = dayRecords.filter((st) => st === 'S').length;
  const totalIzin = dayRecords.filter((st) => st === 'I').length;
  const totalAlfa = dayRecords.filter((st) => st === 'A').length;
  const attendanceRate =
    filteredStudents.length > 0
      ? Math.round((totalHadir / filteredStudents.length) * 100)
      : 100;

  // Class emoji helper
  const getClassEmoji = (name: string) => {
    if (name.includes('Melati')) return '🌸';
    if (name.includes('Mawar')) return '🌹';
    if (name.includes('Bintang')) return '⭐';
    if (name.includes('Bermain') || name.includes('KB')) return '🧸';
    return '🏫';
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            Absensi Murid TK MASYITHOH CIMANGGU
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Presensi harian anak didik per rombel kelas, cek suhu tubuh, dan rekapitulasi kehadiran resmi download PDF / Excel.
          </p>
        </div>

        {/* Tab switch: Presensi Harian vs Rekap Semester */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('harian');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'harian'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presensi Harian
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('rekap');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rekap'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Semester & Rapor
          </button>
        </div>
      </div>

      {/* Success Download Alert Banner */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between gap-3 animate-bounce-slow">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="font-extrabold text-sm">Download Berhasil!</div>
              <div className="text-xs text-emerald-100">{downloadSuccessMessage}</div>
            </div>
          </div>
          <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full whitespace-nowrap">
            Format: PDF A4 Siap Cetak
          </span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-bounce-slow">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Selesai Absen Alert Banner */}
      {finishedClassBanner && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-3 animate-bounce-slow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>✓ Selesai! Presensi Berhasil Disimpan</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                  Tersimpan Otomatis
                </span>
              </div>
              <div className="text-xs text-emerald-100 mt-0.5">
                Presensi untuk rombel <strong>{finishedClassBanner}</strong> tanggal <strong>{selectedDate}</strong> telah <strong>selesai diabsen</strong> dengan lengkap.
              </div>
            </div>
          </div>
          <button
            onClick={() => setFinishedClassBanner(null)}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BAGIAN PEMISAH PER KELAS (PROMINENT CLASS TABS) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Rombel / Kelompok Kelas:
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Total {students.length} anak terdaftar di {classes.length} rombel
          </span>
        </div>

        {/* Tab Buttons per Class */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* ALL CLASSES BUTTON */}
          <button
            onClick={() => {
              soundService.playPop();
              setSelectedClassId('ALL');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedClassId === 'ALL'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🌟</span>
            <span>Semua Kelas</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedClassId === 'ALL' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {students.length} Siswa
            </span>
          </button>

          {/* INDIVIDUAL CLASS TABS */}
          {classes.map((c) => {
            const count = getClassStudentCount(c.id);
            const isSelected = selectedClassId === c.id;
            const emoji = getClassEmoji(c.namaKelas);

            return (
              <button
                key={c.id}
                onClick={() => {
                  soundService.playPop();
                  setSelectedClassId(c.id);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{emoji}</span>
                <span>{c.namaKelas}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count} Siswa
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail Card if Specific Class is Selected */}
        {activeClass && (
          <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-blue-100">
                {getClassEmoji(activeClass.namaKelas)}
              </span>
              <div>
                <div className="font-extrabold text-blue-950 text-sm">{activeClass.namaKelas}</div>
                <div className="text-slate-600 mt-0.5">
                  Wali Kelas: <strong className="text-slate-800">{activeClass.waliKelas}</strong> •{' '}
                  {activeClass.kelompokUsia} • {activeClass.ruang}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleMarkClassPresent(activeClass.id)}
                className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Tandai Semua Hadir di {activeClass.namaKelas.split(' ')[0]}
              </button>
              <button
                onClick={() => handleFinishAttendance(activeClass.id)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Absen
              </button>
              <button
                onClick={() => handleDownloadPdf(activeClass.id)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> PDF Kelas Ini
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date & Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                soundService.playPop();
                setSelectedDate(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              soundService.playPop();
              setSelectedDate('2026-10-29');
            }}
            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-2 rounded-lg cursor-pointer"
          >
            Hari Ini
          </button>
        </div>

        {/* Search Input & Quick Action */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau NISN murid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-blue-500 outline-none"
            />
          </div>

          {activeTab === 'harian' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleMarkClassPresent(selectedClassId)}
                className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <Check className="w-4 h-4 text-emerald-600" /> Tandai Semua Hadir
              </button>
              <button
                onClick={() => handleFinishAttendance(selectedClassId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" /> Selesai Absen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Stat Cards for Selected Scope */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">Murid ({selectedClassId === 'ALL' ? 'Total' : 'Rombel'})</div>
            <div className="text-2xl font-black text-slate-800">{filteredStudents.length}</div>
          </div>
          <span className="text-2xl">👦👧</span>
        </div>

        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-700 font-bold">Hadir (H)</div>
            <div className="text-2xl font-black text-emerald-800">{totalHadir}</div>
          </div>
          <span className="text-2xl">🟢</span>
        </div>

        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-700 font-bold">Sakit (S)</div>
            <div className="text-2xl font-black text-amber-800">{totalSakit}</div>
          </div>
          <span className="text-2xl">🟡</span>
        </div>

        <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-700 font-bold">Izin (I)</div>
            <div className="text-2xl font-black text-blue-800">{totalIzin}</div>
          </div>
          <span className="text-2xl">🔵</span>
        </div>

        <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-xs text-rose-700 font-bold">Alfa (A)</div>
            <div className="text-2xl font-black text-rose-800">{totalAlfa}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500">Tingkat Hadir</span>
            <div className="text-xs font-black text-emerald-700">{attendanceRate}%</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRESENSI HARIAN (DIPISAH PER KELAS) */}
      {/* ========================================================================= */}
      {activeTab === 'harian' ? (
        <div className="space-y-6">
          {activeClassesToDisplay.map((cls) => {
            const classStudents = filteredStudents.filter((s) => s.kelasId === cls.id);
            if (classStudents.length === 0 && selectedClassId !== 'ALL') return null;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Header Section per Class */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{getClassEmoji(cls.namaKelas)}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cls.namaKelas}</h4>
                      <p className="text-xs text-slate-500">
                        Wali Kelas: <strong className="text-slate-700">{cls.waliKelas}</strong> •{' '}
                        {cls.kelompokUsia} • ({classStudents.length} Anak)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkClassPresent(cls.id)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tandai Semua Hadir di {cls.namaKelas.split(' ')[0]}</span>
                    </button>
                    <button
                      onClick={() => handleFinishAttendance(cls.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai Absen</span>
                    </button>
                  </div>
                </div>

                {/* Table for this Class */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Nama Murid</th>
                        <th className="py-3 px-4 text-center">Status Kehadiran</th>
                        <th className="py-3 px-4 text-center">Status Absensi</th>
                        <th className="py-3 px-4 text-center">Suhu Badan</th>
                        <th className="py-3 px-4">Catatan Kondisi / Penjemput</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                            Belum ada murid di kelas ini.
                          </td>
                        </tr>
                      ) : (
                        classStudents.map((st) => {
                          const currentStatus = getStudentStatus(st.id);
                          const note = getStudentNote(st.id);
                          const temp = getStudentTemp(st.id);
                          const attended = isStudentAttended(st.id);

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Student Name */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl p-1 bg-amber-50 rounded-xl border border-amber-200">
                                    {st.fotoAvatar}
                                  </span>
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm">
                                      {st.namaLengkap}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      NISN: {st.nisn} ({st.namaPanggilan})
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Status Buttons */}
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* HADIR */}
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'H')}
                                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                                      currentStatus === 'H'
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                  >
                                    <span>🟢</span> Hadir
                                  </button>

                                  {/* SAKIT */}
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'S')}
                                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                                      currentStatus === 'S'
                                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                    }`}
                                  >
                                    <span>🟡</span> Sakit
                                  </button>

                                  {/* IZIN */}
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'I')}
                                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                                      currentStatus === 'I'
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                                  >
                                    <span>🔵</span> Izin
                                  </button>

                                  {/* ALFA */}
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'A')}
                                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                                      currentStatus === 'A'
                                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    }`}
                                  >
                                    <span>🔴</span> Alfa
                                  </button>
                                </div>
                              </td>

                              {/* Status Absensi Selesai / Belum */}
                              <td className="py-3 px-4 text-center whitespace-nowrap">
                                {attended ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border-2 border-emerald-400 shadow-2xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Selesai</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                                    <span>Belum</span>
                                  </span>
                                )}
                              </td>

                              {/* Temperature */}
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="text"
                                  value={temp}
                                  onChange={(e) => handleTempChange(st.id, e.target.value)}
                                  placeholder="36.5"
                                  className="w-16 text-center py-1 px-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                                />
                                <span className="text-[10px] text-slate-400 block mt-0.5">°C</span>
                              </td>

                              {/* Notes */}
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={note}
                                  onChange={(e) => handleNoteChange(st.id, e.target.value)}
                                  placeholder="Keterangan / kondisi..."
                                  className="w-full py-1.5 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white"
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Class Card Footer: Status Count & Selesai Absen button */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-slate-600 font-semibold">
                      Status Presensi:{' '}
                      <strong className="text-emerald-700 font-black">
                        {classStudents.filter((s) => isStudentAttended(s.id)).length} dari {classStudents.length} murid selesai diabsen
                      </strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleFinishAttendance(cls.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesai Absen {cls.namaKelas.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 2: REKAPITULASI SEMESTER & RAPOR (DIPISAH PER KELAS & DIRECT DOWNLOAD) */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Rekapitulasi Kehadiran Siswa Semester {school.semester}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi kehadiran semesteran. Klik tombol hijau untuk <strong>langsung mengunduh file PDF</strong> ke komputer.
                </p>
              </div>

              {/* Action Buttons: Direct Download PDF, Excel, Sync */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Sync to Rapor */}
                <button
                  onClick={handleSyncToRapor}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Sinkronkan ke Rapor
                </button>

                {/* Direct PDF File Download */}
                <button
                  onClick={() => handleDownloadPdf(selectedClassId)}
                  disabled={isDownloadingPdf}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                  title="Klik untuk langsung mengunduh file PDF Resmi ke folder Downloads"
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Download className="w-4 h-4 text-white" />
                  )}
                  <span>
                    {isDownloadingPdf
                      ? 'Mengunduh PDF...'
                      : selectedClassId === 'ALL'
                      ? 'Download PDF Semua Kelas'
                      : `Download PDF ${activeClass?.namaKelas.split(' ')[0]}`}
                  </span>
                </button>

                {/* Direct Excel / CSV File Download */}
                <button
                  onClick={() => handleDownloadCsv(selectedClassId)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-xs"
                  title="Unduh file spreadsheet Excel (.csv)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Excel/CSV</span>
                </button>

                {/* Print Dialog */}
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-xs"
                  title="Buka dialog cetak printer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>

            {/* Separated Tables per Class for Rekapitulasi */}
            <div className="space-y-6">
              {activeClassesToDisplay.map((cls) => {
                const classStudents = filteredStudents.filter((s) => s.kelasId === cls.id);
                if (classStudents.length === 0 && selectedClassId !== 'ALL') return null;

                return (
                  <div
                    key={cls.id}
                    className="border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                  >
                    {/* Class Bar */}
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getClassEmoji(cls.namaKelas)}</span>
                        <span className="font-bold text-slate-800 text-xs">
                          {cls.namaKelas}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          (Wali: {cls.waliKelas})
                        </span>
                      </div>

                      <button
                        onClick={() => handleDownloadPdf(cls.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh PDF Kelas Ini
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-white border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Nama Murid</th>
                            <th className="py-2.5 px-4 text-center">Hadir</th>
                            <th className="py-2.5 px-4 text-center">Sakit (S)</th>
                            <th className="py-2.5 px-4 text-center">Izin (I)</th>
                            <th className="py-2.5 px-4 text-center">Alfa (A)</th>
                            <th className="py-2.5 px-4 text-center">Persentase</th>
                            <th className="py-2.5 px-4 text-center">Status Rapor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classStudents.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-4 text-center text-slate-400">
                                Tidak ada data murid di rombel ini.
                              </td>
                            </tr>
                          ) : (
                            classStudents.map((st) => {
                              const summary = StorageService.getStudentAttendanceSummary(st.id);
                              const total =
                                summary.hadir + summary.sakit + summary.izin + summary.alfa;
                              const pct =
                                total > 0 ? Math.round((summary.hadir / total) * 100) : 100;

                              return (
                                <tr key={st.id} className="hover:bg-slate-50/60">
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{st.fotoAvatar}</span>
                                      <div>
                                        <span className="font-bold text-slate-800">
                                          {st.namaLengkap}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">
                                          NISN: {st.nisn}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-bold text-emerald-700">
                                    {summary.hadir} hari
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-bold text-amber-700">
                                    {summary.sakit} hari
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-bold text-blue-700">
                                    {summary.izin} hari
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-bold text-rose-700">
                                    {summary.alfa} hari
                                  </td>
                                  <td className="py-2.5 px-4 text-center">
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full text-[10px]">
                                      {pct}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-center">
                                    <span className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{' '}
                                      Tersinkron
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
