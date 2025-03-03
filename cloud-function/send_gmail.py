import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# ข้อมูลการตั้งค่าของผู้ส่ง
gmail_user = 'your-email@gmail.com'         # ใส่ที่อยู่อีเมลของคุณ
app_password = 'your-app-password'          # ใส่ App Password ที่สร้างไว้

# ข้อมูลของผู้รับและเนื้อหาอีเมล
to = 'recipient-email@example.com'          # ใส่อีเมลผู้รับ
subject = 'ทดสอบการส่งอีเมลด้วย Python'   # ใส่หัวเรื่อง
body = 'สวัสดีครับ นี่เป็นอีเมลทดสอบที่ส่งด้วย Python!'  # ใส่เนื้อหาของอีเมล

# การสร้างอีเมล
msg = MIMEMultipart()
msg['From'] = gmail_user
msg['To'] = to
msg['Subject'] = subject
msg.attach(MIMEText(body, 'plain'))

try:
    # การเชื่อมต่อกับ SMTP ของ Gmail
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()  # เปิดการเข้ารหัส TLS
    server.login(gmail_user, app_password)  # เข้าสู่ระบบด้วยอีเมลและรหัสผ่านแอป
    text = msg.as_string()

    # ส่งอีเมล
    server.sendmail(gmail_user, to, text)
    print("อีเมลถูกส่งสำเร็จ!")

except Exception as e:
    print(f"เกิดข้อผิดพลาด: {e}")

finally:
    # ปิดการเชื่อมต่อ
    server.quit()
