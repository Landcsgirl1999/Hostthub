import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAccountWithNumber(userRole: string, accountData: any) {
  // Get the next account number based on user role
  const accountNumber = await getNextAccountNumber(userRole);
  
  // Create the account with the assigned number
  const account = await prisma.account.create({
    data: {
      ...accountData,
      accountNumber
    }
  });
  
  return account;
}

async function getNextAccountNumber(userRole: string): Promise<number> {
  // Check if this is the first super admin
  if (userRole === 'SUPER_ADMIN') {
    const existingSuperAdmin = await prisma.account.findFirst({
      where: { accountNumber: 1 }
    });
    if (!existingSuperAdmin) {
      return 1; // First super admin gets account number 1
    }
  }
  
  // For all other users, get the next number from sequence
  const result = await prisma.$queryRaw`SELECT nextval('regular_account_number_seq') as next_number`;
  return (result as any)[0].next_number;
} 