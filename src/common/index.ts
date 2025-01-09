type LifiError = { message: string; code: number }
export const getLifiError = ({
  message,
  code,
}: {
  message: string
  code: number
}): LifiError => ({
  message,
  code,
})
export const isLifiError = (err: any): err is LifiError =>
  'code' in err && 'message' in err
export const getErrorMessage = (err: any) =>
  'message' in err ? String(err.message) : 'Unknown error'
