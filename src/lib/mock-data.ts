export const user = {
  name: "Aarav Mehta",
  initials: "AM",
  did: "did:indy:bcovrin:8f7a3e9c6f70b42e9d1c5a8b3e2f",
  publicKey: "7JxK4Wp8zQr2mN3vT9bYc6fL1sHdE8gW",
  issuer: "IDBI Bank Limited",
  issuedOn: "18 May 2024",
};

export type Provenance = "on-chain" | "off-chain";

export const stats = {
  totalAssets: "₹12,45,680",
  activeLoans: 2,
  totalTransactions: 128,
  trustScore: 92,
};

export type Credential = {
  id: string;
  type: string;
  issuer: string;
  issuedOn: string;
  status: "verified" | "pending";
  provenance: Provenance;
  usedBy: string[];
};

export const credentials: Credential[] = [
  {
    id: "vc_aadhaar_001",
    type: "Aadhaar Identity",
    issuer: "UIDAI",
    issuedOn: "12 Jan 2023",
    status: "verified",
    provenance: "on-chain",
    usedBy: ["HDFC Bank", "IDBI Bank", "Zerodha"],
  },
  {
    id: "vc_pan_001",
    type: "PAN Card",
    issuer: "Income Tax Dept.",
    issuedOn: "05 Feb 2023",
    status: "verified",
    provenance: "on-chain",
    usedBy: ["HDFC Bank", "IDBI Bank"],
  },
  {
    id: "vc_income_001",
    type: "Income Proof (Form 16)",
    issuer: "Infosys Ltd.",
    issuedOn: "10 Apr 2024",
    status: "verified",
    provenance: "off-chain",
    usedBy: ["IDBI Bank"],
  },
  {
    id: "vc_loan_001",
    type: "Loan Agreement",
    issuer: "IDBI Bank Limited",
    issuedOn: "12 Jun 2024",
    status: "verified",
    provenance: "on-chain",
    usedBy: ["IDBI Bank"],
  },
  {
    id: "vc_addr_001",
    type: "Address Proof",
    issuer: "DigiLocker",
    issuedOn: "22 Mar 2023",
    status: "verified",
    provenance: "off-chain",
    usedBy: ["HDFC Bank"],
  },
];

export type Loan = {
  id: string;
  name: string;
  outstanding: string;
  emi: string;
  interest: string;
  dueDate: string;
  disbursementTx: string;
  status: "active" | "pending";
};

export const loans: Loan[] = [
  {
    id: "loan_home_001",
    name: "Home Loan",
    outstanding: "₹8,20,000",
    emi: "₹42,500",
    interest: "8.45%",
    dueDate: "12 Jun 2026",
    disbursementTx: "0xb36c1a2f9d8e7c4b5a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b",
    status: "active",
  },
  {
    id: "loan_personal_001",
    name: "Personal Loan",
    outstanding: "₹1,15,240",
    emi: "₹12,360",
    interest: "11.20%",
    dueDate: "05 Jun 2026",
    disbursementTx: "0xd63a4c1b7e2f8d9c0a5b6f3e2d1c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c",
    status: "active",
  },
];

export type Transaction = {
  id: string;
  label: string;
  amount: string;
  ts: string;
  tx: string;
  provenance: Provenance;
};

export const transactions: Transaction[] = [
  {
    id: "tx1",
    label: "EMI Payment · Home Loan",
    amount: "₹42,500",
    ts: "2 mins ago",
    tx: "0x9a7d1c3e2b8f4a5d6c7b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    provenance: "on-chain",
  },
  {
    id: "tx2",
    label: "Loan Disbursement · Personal",
    amount: "₹5,00,000",
    ts: "2 days ago",
    tx: "0xd2b1a7d3f4c5e6b8a9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    provenance: "on-chain",
  },
  {
    id: "tx3",
    label: "KYC Verified",
    amount: "—",
    ts: "5 days ago",
    tx: "0x7c8eb6f9a1d3c5b7e9f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4",
    provenance: "on-chain",
  },
  {
    id: "tx4",
    label: "Profile Updated",
    amount: "—",
    ts: "1 week ago",
    tx: "—",
    provenance: "off-chain",
  },
];

export type Approval = {
  id: string;
  applicant: string;
  did: string;
  requested: string;
  amount: string;
  submitted: string;
  stage: string;
};

export const approvals: Approval[] = [
  {
    id: "req_001",
    applicant: "Priya Sharma",
    did: "did:indy:bcovrin:a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2",
    requested: "Home Loan · ₹35,00,000",
    amount: "₹35,00,000",
    submitted: "3 hours ago",
    stage: "Officer Review",
  },
  {
    id: "req_002",
    applicant: "Rohit Kumar",
    did: "did:indy:bcovrin:f1e2d3c4b5a6978869f4e3d2c1b0a9f8",
    requested: "Personal Loan · ₹4,50,000",
    amount: "₹4,50,000",
    submitted: "6 hours ago",
    stage: "Manager Approval",
  },
  {
    id: "req_003",
    applicant: "Neha Verma",
    did: "did:indy:bcovrin:c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    requested: "Education Loan · ₹12,00,000",
    amount: "₹12,00,000",
    submitted: "1 day ago",
    stage: "Risk Team",
  },
];

export const auditEvents = [
  { label: "EMI Payment received", who: "Aarav Mehta", ts: "2 mins ago", tx: "0x9a7d1c3e2b8f4a5d", type: "on-chain" as const },
  { label: "Loan sanctioned", who: "Priya Sharma", ts: "1 hr ago", tx: "0x4f8e2d6c1b3a9e7f", type: "on-chain" as const },
  { label: "KYC credential issued", who: "Rohit Kumar", ts: "3 hrs ago", tx: "0xabc123def456789a", type: "on-chain" as const },
  { label: "Selective disclosure proof shared", who: "Neha Verma", ts: "5 hrs ago", tx: "0x77e88f99a0b1c2d3", type: "on-chain" as const },
  { label: "Document uploaded", who: "Aarav Mehta", ts: "1 day ago", tx: "—", type: "off-chain" as const },
  { label: "Cross-chain transfer via CCIP", who: "IDBI ↔ HDFC", ts: "2 days ago", tx: "0xccipf00dcafebabe", type: "on-chain" as const },
];

export function short(s: string, head = 6, tail = 4) {
  if (!s || s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}
