import {z} from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// const body = {
//   name: 'Jane Doe',
//   email: 'jane.doe@example.com',
// }
// const result = createUserSchema.safeParse(body)



export function validate(body: any) {
  const result = createUserSchema.safeParse(body)
  // console.log(result,'result');
  return result
}


// if (!result.success) {
//   //  res.status(400).json({
//   //   success: false,
//   //   code: 'INVALID_PARAMS',
//   //   errors: result.error.issues
//   // })
// }

