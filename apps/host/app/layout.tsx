import 'antd/dist/reset.css'  


export const metadata = {
  title: 'Prova BE<->FE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
