export function formatDateTimeSpanish(isoString: string) {
  if (!isoString) return '';

  const date = new Date(isoString);

  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const monthName = months[date.getMonth()];

  // Get hours and minutes with leading zeros
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} de ${monthName} de ${year}, ${hours}:${minutes}`;
}
