import { RebootModel } from '@/models/Reboot'

export default async function Reboot() {
  const newReboot = new RebootModel({ value: true })
  await newReboot.save()
}
