import { useState } from 'react';
import { Printer, Sparkles, Save, CheckCircle2, Award, User, ChevronRight, Download, Loader2, FileDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student, SchoolProfile, ClassRoom, RaporAssessment, NilaiCapaian } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface RaporManagementViewProps {
  school: SchoolProfile;
  students: Student[];
  classes: ClassRoom[];
  assessments: RaporAssessment[];
  initialStudentId?: string;
  onSaveAssessment: (assessment: RaporAssessment) => void;
}

export function RaporManagementView({
  school,
  students,
  classes,
  assessments,
  initialStudentId,
  onSaveAssessment,
}: RaporManagementViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || students[0]?.id || ''
  );
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const currentClass = classes.find((c) => c.id === currentStudent?.kelasId);

  // Find or initialize assessment for this student
  const existingAssessment = assessments.find(
    (a) => a.studentId === currentStudent?.id && a.semester === school.semester
  );

  const [agamaCapaian, setAgamaCapaian] = useState<NilaiCapaian>(existingAssessment?.agamaBudiPekerti.capaian || 'BSB');
  const [agamaNarasi, setAgamaNarasi] = useState<string>(
    existingAssessment?.agamaBudiPekerti.narasi ||
      `Ananda ${currentStudent?.namaPanggilan} menunjukkan sikap religius yang sangat baik. Senantiasa terbiasa melafalkan doa sebelum dan sesudah kegiatan belajar, mengucap salam dengan santun, serta menyayangi sesama teman.`
  );

  const [jatiDiriCapaian, setJatiDiriCapaian] = useState<NilaiCapaian>(existingAssessment?.jatiDiri.capaian || 'BSH');
  const [jatiDiriNarasi, setJatiDiriNarasi] = useState<string>(
    existingAssessment?.jatiDiri.narasi ||
      `Ananda ${currentStudent?.namaPanggilan} mampu mengenali dan mengekspresikan emosinya dengan wajar. Terbiasa mandiri mencuci tangan, merapikan alat bermain setelah belajar, serta aktif dalam permainan fisik motorik.`
  );

  const [steamCapaian, setSteamCapaian] = useState<NilaiCapaian>(existingAssessment?.dasarLiterasiSteam.capaian || 'BSB');
  const [steamNarasi, setSteamNarasi] = useState<string>(
    existingAssessment?.dasarLiterasiSteam.narasi ||
      `Kemampuan literasi dan numerasi Ananda ${currentStudent?.namaPanggilan} berkembang sangat pesat. Mampu mengenal huruf alfabet A-Z, menghitung jumlah benda 1 sampai 10, dan sangat antusias dalam kegiatan mewarnai serta bernyanyi.`
  );

  const [catatanGuru, setCatatanGuru] = useState<string>(
    existingAssessment?.catatanGuru ||
      `Teruslah bersemangat belajar dan berkarya ya Ananda ${currentStudent?.namaPanggilan}. Kamu anak yang hebat, cerdas, dan membanggakan!`
  );

  const [sakit, setSakit] = useState<number>(existingAssessment?.kehadiranSakit || 0);
  const [izin, setIzin] = useState<number>(existingAssessment?.kehadiranIzin || 0);
  const [alfa, setAlfa] = useState<number>(existingAssessment?.kehadiranAlfa || 0);

  // When student selection changes, sync state
  const handleStudentSelect = (id: string) => {
    soundService.playPop();
    setSelectedStudentId(id);
    const st = students.find((s) => s.id === id);
    const ass = assessments.find((a) => a.studentId === id && a.semester === school.semester);

    if (ass) {
      setAgamaCapaian(ass.agamaBudiPekerti.capaian);
      setAgamaNarasi(ass.agamaBudiPekerti.narasi);
      setJatiDiriCapaian(ass.jatiDiri.capaian);
      setJatiDiriNarasi(ass.jatiDiri.narasi);
      setSteamCapaian(ass.dasarLiterasiSteam.capaian);
      setSteamNarasi(ass.dasarLiterasiSteam.narasi);
      setCatatanGuru(ass.catatanGuru);
      setSakit(ass.kehadiranSakit);
      setIzin(ass.kehadiranIzin);
      setAlfa(ass.kehadiranAlfa);
    } else if (st) {
      setAgamaCapaian('BSB');
      setAgamaNarasi(
        `Ananda ${st.namaPanggilan} menunjukkan sikap religius yang sangat baik. Senantiasa terbiasa melafalkan doa sebelum dan sesudah kegiatan belajar, mengucap salam dengan santun, serta menyayangi sesama teman.`
      );
      setJatiDiriCapaian('BSH');
      setJatiDiriNarasi(
        `Ananda ${st.namaPanggilan} mampu mengenali dan mengekspresikan emosinya dengan wajar. Terbiasa mandiri mencuci tangan, merapikan alat bermain, serta aktif dalam kegiatan motorik.`
      );
      setSteamCapaian('BSB');
      setSteamNarasi(
        `Kemampuan literasi dan eksplorasi STEAM Ananda ${st.namaPanggilan} berkembang sangat optimal. Menunjukkan rasa ingin tahu yang tinggi terhadap pengenalan simbol huruf dan berhitung benda.`
      );
      setCatatanGuru(`Pertahankan keceriaan dan antusiasme belajarmu ya Ananda ${st.namaPanggilan} tersayang.`);
      setSakit(0);
      setIzin(0);
      setAlfa(0);
    }
  };

  // AI Narrative Generator for PAUD Teacher
  const handleGenerateAiNarration = () => {
    soundService.playSparkle();
    setIsAiGenerating(true);

    setTimeout(() => {
      const name = currentStudent.namaPanggilan;
      const stars = currentStudent.bintangTerkumpul;

      setAgamaNarasi(
        `Alhamdulillah, Ananda ${name} menunjukkan perkembangan nilai agama dan budi pekerti yang sangat menggembirakan (BSB). ${name} terbiasa mengucapkan doa harian dengan khusyuk, menunjukkan rasa kasih sayang kepada semua teman, serta selalu mengucap tolong dan terima kasih saat berinteraksi di sekolah.`
      );

      setJatiDiriNarasi(
        `Pada elemen Jati Diri, Ananda ${name} berkembang sesuai harapan yang membanggakan (BSH). ${name} memiliki kemandirian yang baik dalam merawat peralatan sekolah sendiri, luwes dalam kegiatan motorik kasar seperti melompat dan menari, serta mampu bekerja sama secara harmonis dalam permainan kelompok.`
      );

      setSteamNarasi(
        `Pada elemen Dasar Literasi dan STEAM, Ananda ${name} berkembang sangat baik (BSB). Terbukti dari aktivitas e-learningnya yang telah mengumpulkan ${stars} bintang emas. ${name} fasih mengenal bunyi fonik huruf alfabet, cakap dalam membilang benda hingga angka 10, serta memiliki imajinasi warna yang sangat artistik saat melukis.`
      );

      setCatatanGuru(
        `Ananda ${name} adalah pembelajar cilik yang penuh semangat, ceria, dan berakhlak mulia. Kami berdoa semoga ${name} tumbuh menjadi anak yang sholeh/sholehah dan sukses meraih cita-citanya.`
      );

      setIsAiGenerating(false);
      soundService.speakIndonesian(
        `Narasi rapor Kurikulum Merdeka untuk Ananda ${name} telah berhasil disusun oleh Asisten AI Guru.`
      );
    }, 800);
  };

  const handleSave = () => {
    soundService.playVictory();
    const newAssessment: RaporAssessment = {
      id: existingAssessment?.id || `rap-${Date.now()}`,
      studentId: currentStudent.id,
      tahunAjaran: school.tahunAjaran,
      semester: school.semester,
      agamaBudiPekerti: {
        capaian: agamaCapaian,
        narasi: agamaNarasi,
      },
      jatiDiri: {
        capaian: jatiDiriCapaian,
        narasi: jatiDiriNarasi,
      },
      dasarLiterasiSteam: {
        capaian: steamCapaian,
        narasi: steamNarasi,
      },
      catatanGuru,
      kehadiranSakit: sakit,
      kehadiranIzin: izin,
      kehadiranAlfa: alfa,
      tanggalRapor: '2026-10-25',
    };

    onSaveAssessment(newAssessment);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const capaianBadge = (c: NilaiCapaian) => {
    switch (c) {
      case 'BSB':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs">BSB (Berkembang Sangat Baik)</span>;
      case 'BSH':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-xs">BSH (Berkembang Sesuai Harapan)</span>;
      case 'MB':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-xs">MB (Mulai Berkembang)</span>;
      case 'BB':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-xs">BB (Belum Berkembang)</span>;
    }
  };

  // Print via isolated iframe to ensure 100% identical styling, borders, and badges without sidebar/scrollbar artifacts
  const handlePrint = () => {
    soundService.playSparkle();
    const sheetElement = document.getElementById('official-rapor-sheet');
    if (!sheetElement) {
      window.print();
      return;
    }

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    printIframe.title = 'Rapor Print Frame';
    document.body.appendChild(printIframe);

    const pri = printIframe.contentWindow;
    if (!pri) {
      window.print();
      return;
    }

    let headStyles = '';
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
      headStyles += el.outerHTML;
    });

    pri.document.open();
    pri.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor TK - ${currentStudent.namaLengkap}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  ${headStyles}
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      background-color: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Nunito', system-ui, -apple-system, sans-serif !important;
    }
    .print-wrapper {
      width: 100% !important;
      max-width: 860px !important;
      margin: 0 auto !important;
      padding: 0 !important;
    }
    #official-rapor-sheet {
      box-shadow: none !important;
      margin: 0 auto !important;
      width: 100% !important;
      max-width: 100% !important;
      border: 1.5px solid #cbd5e1 !important;
      border-radius: 12px !important;
      padding: 24px 28px !important;
      background-color: #ffffff !important;
    }
  </style>
</head>
<body>
  <div class="print-wrapper">
    ${sheetElement.outerHTML}
  </div>
</body>
</html>`);
    pri.document.close();

    pri.focus();
    setTimeout(() => {
      pri.print();
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 2000);
    }, 450);
  };

  // Download Rapor as real high-fidelity PDF using html2canvas & jsPDF with strict aspect ratio preservation
  const handleDownloadPdf = async () => {
    const sheetElement = document.getElementById('official-rapor-sheet');
    if (!sheetElement) return;

    try {
      setIsDownloadingPdf(true);
      soundService.playSparkle();

      // High-res desktop capture to prevent responsive mobile squishing
      const canvas = await html2canvas(sheetElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10; // 10mm margin
      const usableWidth = pageWidth - margin * 2; // 190mm
      const usableHeight = pageHeight - margin * 2; // 277mm
      
      // Calculate exact height preserving aspect ratio
      const aspectRatio = canvas.height / canvas.width;
      const printHeight = usableWidth * aspectRatio;

      if (printHeight <= usableHeight) {
        // Fits perfectly on 1 page with 10mm margins on all sides
        pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, printHeight, undefined, 'FAST');
      } else if (printHeight <= 315) {
        // Slightly overflows: proportionally scale down so it fits gracefully on 1 page without distortion
        const scale = usableHeight / printHeight;
        const scaledWidth = usableWidth * scale;
        const scaledHeight = usableHeight;
        const xOffset = margin + (usableWidth - scaledWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, margin, scaledWidth, scaledHeight, undefined, 'FAST');
      } else {
        // Multi-page document: paginate cleanly across pages without squashing
        let heightLeft = printHeight;
        let position = margin;
        let page = 1;

        while (heightLeft > 0) {
          if (page > 1) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'PNG', margin, position, usableWidth, printHeight, undefined, 'FAST');
          heightLeft -= usableHeight;
          position -= usableHeight;
          page++;
        }
      }

      const safeName = currentStudent.namaPanggilan.replace(/\s+/g, '_');
      const safeTahun = school.tahunAjaran.replace('/', '-');
      const fileName = `Rapor_TK_${safeName}_${safeTahun}.pdf`;

      pdf.save(fileName);

      soundService.playVictory();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setDownloadSuccess(true);
      soundService.speakIndonesian(`Rapor ${currentStudent.namaPanggilan} berhasil diunduh dalam format PDF!`);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('PDF generation error, fallback to HTML document:', err);
      handleDownloadHtmlDoc();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Fallback / Standalone formatted HTML document download with full Tailwind and responsive print styling
  const handleDownloadHtmlDoc = () => {
    const sheetElement = document.getElementById('official-rapor-sheet');
    if (!sheetElement) return;

    const safeName = currentStudent.namaPanggilan.replace(/\s+/g, '_');
    const safeTahun = school.tahunAjaran.replace('/', '-');
    const fileName = `Rapor_TK_${safeName}_${safeTahun}.html`;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor TK - ${currentStudent.namaLengkap}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: 'Nunito', system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      padding: 24px 12px;
      margin: 0;
      color: #0f172a;
    }
    .print-bar {
      background: #059669;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      margin-bottom: 24px;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.12);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .print-bar:hover { background: #047857; }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .print-bar { display: none !important; }
      #official-rapor-sheet {
        box-shadow: none !important;
        border: 1.5px solid #cbd5e1 !important;
        border-radius: 12px !important;
        margin: 0 auto !important;
      }
    }
  </style>
</head>
<body>
  <div style="max-width: 860px; margin: 0 auto; text-align: center;">
    <button class="print-bar" onclick="window.print()">🖨️ Cetak Dokumen / Simpan sebagai PDF</button>
  </div>
  <div style="max-width: 860px; margin: 0 auto;">
    ${sheetElement.outerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    soundService.playVictory();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Manajemen Rapor Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500">
            Penilaian capaian perkembangan anak usia dini berbasis narasi deskriptif dan integrasi aktivitas e-learning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintPreview(!isPrintPreview)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {isPrintPreview ? 'Tutup Preview' : 'Preview & Cetak Rapor'}
          </button>
        </div>
      </div>

      {/* Student Selector Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
          Pilih Peserta Didik untuk Dinilai:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {students.map((st) => {
            const isSelected = st.id === selectedStudentId;
            return (
              <button
                key={st.id}
                onClick={() => handleStudentSelect(st.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{st.fotoAvatar}</span>
                <span>{st.namaLengkap}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!isPrintPreview ? (
        /* Form Assessment Mode */
        <div className="space-y-6">
          {/* Student Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-4xl flex items-center justify-center border-2 border-white/40">
                {currentStudent.fotoAvatar}
              </div>
              <div>
                <h4 className="text-xl font-black">{currentStudent.namaLengkap}</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-100 mt-1">
                  <span>NISN: {currentStudent.nisn}</span>
                  <span>•</span>
                  <span>Kelas: {currentClass?.namaKelas}</span>
                  <span>•</span>
                  <span>Tahun Ajaran: {school.tahunAjaran} ({school.semester})</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateAiNarration}
              disabled={isAiGenerating}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-900 animate-spin" />
              {isAiGenerating ? 'Menyusun Narasi AI...' : '✨ Generate Narasi Otomatis AI'}
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Data rapor berhasil disimpan ke sistem!
            </div>
          )}

          {/* 3 Core Curriculum Elements */}
          <div className="space-y-4">
            {/* Element 1: Agama & Budi Pekerti */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Elemen Nilai Agama dan Budi Pekerti
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mengenal Tuhan, doa harian, perilaku santun, toleransi, menyayangi ciptaan-Nya.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Capaian:</span>
                  <select
                    value={agamaCapaian}
                    onChange={(e) => setAgamaCapaian(e.target.value as NilaiCapaian)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  >
                    <option value="BSB">BSB (Berkembang Sangat Baik)</option>
                    <option value="BSH">BSH (Berkembang Sesuai Harapan)</option>
                    <option value="MB">MB (Mulai Berkembang)</option>
                    <option value="BB">BB (Belum Berkembang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Narasi Deskripsi Perkembangan:
                </label>
                <textarea
                  rows={3}
                  value={agamaNarasi}
                  onChange={(e) => setAgamaNarasi(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Element 2: Jati Diri */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Elemen Jati Diri
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mengenali emosi diri, kemandirian fisik, kebersihan diri, motorik kasar & halus.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Capaian:</span>
                  <select
                    value={jatiDiriCapaian}
                    onChange={(e) => setJatiDiriCapaian(e.target.value as NilaiCapaian)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  >
                    <option value="BSB">BSB (Berkembang Sangat Baik)</option>
                    <option value="BSH">BSH (Berkembang Sesuai Harapan)</option>
                    <option value="MB">MB (Mulai Berkembang)</option>
                    <option value="BB">BB (Belum Berkembang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Narasi Deskripsi Perkembangan:
                </label>
                <textarea
                  rows={3}
                  value={jatiDiriNarasi}
                  onChange={(e) => setJatiDiriNarasi(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Element 3: Dasar Literasi & STEAM */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    3. Elemen Dasar Literasi, Matematika, Sains, Rekayasa, dan Seni (STEAM)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Simbol huruf, fonik, membilang angka, pengenalan warna/bentuk, eksplorasi seni rupa & lagu.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Capaian:</span>
                  <select
                    value={steamCapaian}
                    onChange={(e) => setSteamCapaian(e.target.value as NilaiCapaian)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  >
                    <option value="BSB">BSB (Berkembang Sangat Baik)</option>
                    <option value="BSH">BSH (Berkembang Sesuai Harapan)</option>
                    <option value="MB">MB (Mulai Berkembang)</option>
                    <option value="BB">BB (Belum Berkembang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Narasi Deskripsi Perkembangan:
                </label>
                <textarea
                  rows={3}
                  value={steamNarasi}
                  onChange={(e) => setSteamNarasi(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Catatan Guru & Kehadiran */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan & Pesan Pendidik / Guru Walikelas:
                </label>
                <textarea
                  rows={2}
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rekap Presensi / Kehadiran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Sakit</span>
                    <input
                      type="number"
                      value={sakit}
                      onChange={(e) => setSakit(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Izin</span>
                    <input
                      type="number"
                      value={izin}
                      onChange={(e) => setIzin(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Alfa</span>
                    <input
                      type="number"
                      value={alfa}
                      onChange={(e) => setAlfa(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsPrintPreview(true)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Lihat Format Rapor Siap Cetak
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" /> Simpan Penilaian Rapor
            </button>
          </div>
        </div>
      ) : (
        /* Printable Formal Report Card (Kop Surat, Format Resmi Rapor PAUD Kurikulum Merdeka) */
        <div className="space-y-4">
          {/* Top Action Toolbar for Print & Direct PDF Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden bg-slate-100/90 backdrop-blur p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Lembar Rapor TK: <span className="text-blue-700 font-extrabold">{currentStudent.namaLengkap}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Kurikulum Merdeka • Tahun Ajaran {school.tahunAjaran} ({school.semester})
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Primary Green Button - Exactly matches user screenshot and triggers clean print preview dialog */}
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                title="Buka dialog cetak rapor resmi atau Simpan ke PDF (Format A4 Kurikulum Merdeka)"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sekarang (PDF / Kertas)</span>
              </button>

              {/* Direct PDF Download Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                title="Download langsung file format .pdf"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download File PDF (.pdf)</span>
              </button>

              {/* Standalone HTML Document Download */}
              <button
                onClick={handleDownloadHtmlDoc}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Unduh file dokumen HTML mandiri (bisa dibuka offline)"
              >
                <FileDown className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">File HTML</span>
              </button>
            </div>
          </div>

          {/* Success Banner upon download */}
          {downloadSuccess && (
            <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 p-3.5 rounded-xl text-xs font-black flex items-center justify-between gap-3 animate-bounce-slow shadow-sm print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Horeee! File Rapor Ananda <strong>{currentStudent.namaLengkap}</strong> berhasil diunduh ke folder Downloads komputermu!
                </span>
              </div>
              <span className="bg-white/80 text-emerald-800 px-3 py-1 rounded-full text-[11px] shadow-xs shrink-0">
                Format: PDF A4 Siap Cetak
              </span>
            </div>
          )}


          <div
            id="official-rapor-sheet"
            className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-300 max-w-4xl mx-auto text-slate-900 font-serif space-y-6"
          >
            {/* Kop Surat Sekolah */}
            <div className="border-b-4 border-double border-slate-800 pb-4 text-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">{school.namaSekolah}</h2>
              <p className="text-xs font-sans text-slate-600 mt-0.5">
                NPSN: {school.npsn} • Alamat: {school.alamat}, Kec. {school.kecamatan}, {school.kabKota}, {school.provinsi}
              </p>
              <p className="text-[11px] font-sans text-slate-500">
                Email: {school.email} • Telp/HP: {school.hp}
              </p>
            </div>

            {/* Title */}
            <div className="text-center font-sans">
              <h3 className="text-base font-bold uppercase tracking-wide">
                LAPORAN CAPAIAN PEMBELAJARAN PESERTA DIDIK (RAPOR TK)
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                KURIKULUM MERDEKA • TAHUN AJARAN {school.tahunAjaran}
              </p>
            </div>

            {/* Identitas Siswa */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-sans border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Nama Peserta Didik</span>
                <span className="mr-2">:</span>
                <span className="font-bold">{currentStudent.namaLengkap}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Nomor Induk / NISN</span>
                <span className="mr-2">:</span>
                <span className="font-mono">{currentStudent.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Kelompok / Kelas</span>
                <span className="mr-2">:</span>
                <span>{currentClass?.namaKelas}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Semester</span>
                <span className="mr-2">:</span>
                <span>{school.semester}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Pertumbuhan Fisik</span>
                <span className="mr-2">:</span>
                <span>TB: {currentStudent.tinggiBadanCm} cm, BB: {currentStudent.beratBadanKg} kg</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Bintang E-Learning</span>
                <span className="mr-2">:</span>
                <span className="font-bold text-amber-600">⭐ {currentStudent.bintangTerkumpul} Bintang</span>
              </div>
            </div>

            {/* Deskripsi Capaian 3 Elemen */}
            <div className="space-y-4 font-sans text-xs">
              <div className="border border-slate-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2 pb-1 border-b">
                  <span className="font-bold text-slate-900 text-sm">A. Nilai Agama dan Budi Pekerti</span>
                  {capaianBadge(agamaCapaian)}
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">{agamaNarasi}</p>
              </div>

              <div className="border border-slate-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2 pb-1 border-b">
                  <span className="font-bold text-slate-900 text-sm">B. Jati Diri</span>
                  {capaianBadge(jatiDiriCapaian)}
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">{jatiDiriNarasi}</p>
              </div>

              <div className="border border-slate-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2 pb-1 border-b">
                  <span className="font-bold text-slate-900 text-sm">
                    C. Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM)
                  </span>
                  {capaianBadge(steamCapaian)}
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">{steamNarasi}</p>
              </div>

              {/* Catatan Guru & Presensi */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 border border-slate-300 rounded-lg p-3">
                  <span className="font-bold text-slate-900 block mb-1">Catatan Pendidik:</span>
                  <p className="text-slate-700 italic">"{catatanGuru}"</p>
                </div>
                <div className="border border-slate-300 rounded-lg p-3 text-center">
                  <span className="font-bold text-slate-900 block mb-1">Ketidakhadiran:</span>
                  <div className="text-[11px] space-y-0.5 text-slate-600">
                    <div>Sakit: {sakit} hari</div>
                    <div>Izin: {izin} hari</div>
                    <div>Tanpa Keterangan: {alfa} hari</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-3 gap-4 text-center font-sans text-xs pt-8">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-800">Orang Tua / Wali Murid</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="text-slate-300">..................................</span>
                </div>
              </div>

              <div>
                <p className="text-slate-600">{school.kabKota}, 25 Oktober 2026</p>
                <p className="font-bold text-slate-800">Guru Wali Kelas</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="font-bold underline">{currentClass?.waliKelas || 'Guru Kelas'}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-800">Kepala Satuan TK</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="font-bold underline">{school.kepalaSekolah}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
