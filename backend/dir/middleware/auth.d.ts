declare const verifyToken: (req: any, res: any, next: any) => any;
declare const requireAdmin: (req: any, res: any, next: any) => any;
export { requireAdmin };
export default verifyToken;
