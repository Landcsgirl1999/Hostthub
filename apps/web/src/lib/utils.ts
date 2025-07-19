
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCopyrightText(companyName: string = 'Hostithub'): string {
  const currentYear = getCurrentYear();
  return `© ${currentYear} ${companyName}. All rights reserved.`;
} 