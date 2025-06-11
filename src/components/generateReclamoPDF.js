import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // Importe el logo
// import Logo from '../assets/LogoChico.png';
// // Importe firma
// import Firma from '../assets/leg7393-04-25.png'

// export const generateReclamoPDF = async ({ legajo, nombre, mes, secuencia, motivo }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const doc = new jsPDF();
      
//       doc.setFont('helvetica');
//       doc.setFontSize(12);
      
//       // Añadir el logo
//       // Cargamos la imagen
//       const img = new Image();
//       img.src = Logo;
      
//       // Esperamos a que cargue la imagen
//       await new Promise((resolve) => {
//         img.onload = resolve;
//       });

//       // Añadir el Logo al PDF (posicion X, Y, ancho, alto)
//       doc.addImage(img, 'PNG', 15, 10, 30, 15);
      
//       // Encabezado
//       doc.setFontSize(14);
//       doc.text('RECLAMO POR DIFERENCIA DE HABERES', 105, 20, { align: 'center' });
//       doc.setFontSize(12);
//       doc.text('Sres. SiBus', 105, 30, { align: 'center' });
      
//       // Datos del reclamo
//       doc.text(`LEGAJO N°: ${legajo}`, 20, 45);
//       doc.text(`APELLIDO Y NOMBRE: ${nombre}`, 20, 55);
      
//       // Texto del reclamo
//       doc.text(`Solicito por medio de la presente se me abone la diferencia de haberes`, 20, 70);
//       doc.text(`Correspondiente al mes de ${mes}`, 20, 80);
      
//       // Motivo del reclamo
//       doc.text('Motivada por:', 20, 95);
//       const motivoLines = doc.splitTextToSize(motivo, 170);
//       doc.text(motivoLines, 20, 105);
      
//       // Pie de página
//       doc.text('Documentación que certifica el presente reclamo:', 20, 180);
//       doc.text('Sin otro particular, saludo atte.', 20, 190);
      
//       // Firmas
//       // Añadir la Firma
//       // DESPUES CAMBIAR PARA TRAER DE BASE DE DATOS
//       const imgF = new Image();
//       imgF.src = Firma;
//       // Esperamos a que cargue la imagen
//       await new Promise((resolve) => {
//         imgF.onload = resolve;
//       });

//       // Añadir la firma al PDF (posicion X, Y, ancho, alto)
//       doc.addImage(imgF, 'PNG', 50, 200, 50, 30);
//       doc.text('_____________________________', 30, 220);
//       doc.text('FIRMA', 50, 230);
      
//       doc.text('_____________________________', 120, 220);
//       doc.text('RECIBE POR SiBus', 130, 230);
      
//       // Resolución
//       doc.text('ACLARACION/RESOLUCION:', 20, 250);
//       doc.line(20, 255, 190, 255);
//       doc.line(20, 265, 190, 265);
      
//       doc.text('_____________________________', 120, 280);
//       doc.text('FIRMA AUTORIZADA', 130, 290);
      
//       // Generar el PDF y forzar descarga
//       const fileName = `Reclamo_${legajo}_${mes.replace('/', '_')}_${Date.now()}.pdf`;
      
//       // Guardar el PDF (esto lo descargará directamente el usuario)
//       doc.save(fileName);
      
//       // Alternativa: Devuelve el blob del PDF para enviarlo al backend
//       const pdfBlob = doc.output('blob');
//       resolve({
//         blob: pdfBlob,
//         fileName: fileName
//       });
      
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
import Logo from '../assets/LogoChico.png';

export const generateReclamoPDF = async ({ legajo, nombre, mes, secuencia, motivo, firmaBase64 }) => {
  try {
    const doc = new jsPDF();

    doc.setFont('helvetica');
    doc.setFontSize(12);

    // Cargar y agregar logo
    const logoImg = new Image();
    logoImg.src = Logo;
    await new Promise(resolve => { logoImg.onload = resolve; });
    doc.addImage(logoImg, 'PNG', 15, 10, 30, 15);

    // Encabezado
    doc.setFontSize(14);
    doc.text('RECLAMO POR DIFERENCIA DE HABERES', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Sres. SiBus', 105, 30, { align: 'center' });

    // Datos del reclamo
    doc.text(`LEGAJO N°: ${legajo}`, 20, 45);
    doc.text(`APELLIDO Y NOMBRE: ${nombre}`, 20, 55);

    doc.text(`Solicito por medio de la presente se me abone la diferencia de haberes`, 20, 70);
    doc.text(`Correspondiente al mes de ${mes}`, 20, 80);

    // Motivo del reclamo
    doc.text('Motivada por:', 20, 95);
    const motivoLines = doc.splitTextToSize(motivo, 170);
    doc.text(motivoLines, 20, 105);

    // Pie de página
    doc.text('Documentación que certifica el presente reclamo:', 20, 180);
    doc.text('Sin otro particular, saludo atte.', 20, 190);

    // Firma real del empleado
    if (firmaBase64) {
      const firmaImg = new Image();
      firmaImg.src = `data:image/png;base64,${firmaBase64}`;
      await new Promise(resolve => { firmaImg.onload = resolve; });
      doc.addImage(firmaImg, 'PNG', 50, 200, 50, 30);
    } else {
      doc.text('Firma no disponible', 50, 210);
    }

    doc.text('_____________________________', 30, 220);
    doc.text('FIRMA', 50, 230);
    doc.text('_____________________________', 120, 220);
    doc.text('RECIBE POR SiBus', 130, 230);

    doc.text('ACLARACION/RESOLUCION:', 20, 250);
    doc.line(20, 255, 190, 255);
    doc.line(20, 265, 190, 265);
    doc.text('_____________________________', 120, 280);
    doc.text('FIRMA AUTORIZADA', 130, 290);

    // Mostrar en nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    // Opcional: retornar blob o URL por si lo necesitás en otro componente
    return {
      blob: pdfBlob,
      url: pdfUrl
    };

  } catch (error) {
    console.error('Error al generar el PDF del reclamo:', error);
    throw error;
  }
};
