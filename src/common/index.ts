export type LifiError = { message: string; code: number }
export const LifiError = ({
  message,
  code,
}: {
  message: string
  code: number
}): LifiError => ({
  message,
  code,
})
export const getErrorMessage = (err: any) =>
  'message' in err ? String(err.message) : 'Unknown error'
