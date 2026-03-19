export type CarteirinhaActions = {
  exportLabel: string;
  copyLabel: string;
  removeLabel: string;
};

export type CarteirinhaOverview = {
  updatedAt: string;
  status: string;
  clubName: string;
  memberName: string;
  memberNumber: string;
  planName: string;
  validUntil: string;
  qrCode: string;
  actions: CarteirinhaActions;
};
