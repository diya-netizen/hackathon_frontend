import 'antd/dist/reset.css';
import { ConfigProvider } from "antd";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
