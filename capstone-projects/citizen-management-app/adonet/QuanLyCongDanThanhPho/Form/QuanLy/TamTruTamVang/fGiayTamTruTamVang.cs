using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fGiayTamTruTamVang : Form
    {
        TamTruTamVang tttv;
        Bitmap bitmap;
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();

        public fGiayTamTruTamVang(TamTruTamVang tttv)
        {
            InitializeComponent();
            this.tttv = tttv;
        }

        void TaoManHinhIn()
        {
            Panel panel = new Panel();
            this.Controls.Add(panel);

            Graphics graphics = panel.CreateGraphics();
            Size size = this.ClientSize;
            bitmap = new Bitmap(size.Width, size.Height, graphics);
            graphics = Graphics.FromImage(bitmap);

            Point point = PointToScreen(panel.Location);
            graphics.CopyFromScreen(point.X, point.Y, 0, 0, size);
        }

        void LoadThongTin()
        {
            btMaCD.Text = tttv.CongDan.MaCD.ToString();
            btHoTen.Text = tttv.CongDan.HoTen;
            btNgaySinh.Text = tttv.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = tttv.CongDan.NoiSinh;

            if (tttv.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(tttv.CongDan.MaCD);
            if (tt != null)
            {
                btMaHo.Text = tt.MaHo.ToString();
                btTinhThanh.Text = tt.HoKhau.TinhThanh;
                btQuanHuyen.Text = tt.HoKhau.QuanHuyen;
                btPhuongXa.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                btMaHo.Text = "";
                btTinhThanh.Text = "";
                btQuanHuyen.Text = "";
                btPhuongXa.Text = "";
            }

            btNgayDK.Text = tttv.NgayDangKy.ToString("dd-MM-yyyy");
            btNgayHetTH.Text = (tttv.NgayDangKy.AddDays(730)).ToString("dd-MM-yyyy");

            HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(tttv.MaHo);
            if (hk != null)
            {
                btMaHoDK.Text = hk.MaHo.ToString();
                btTinhThanhDK.Text = hk.TinhThanh;
                btQuanHuyenDK.Text = hk.QuanHuyen;
                btPhuongXaDK.Text = hk.PhuongXa;
            }
            else
            {
                btMaHoDK.Text = "";
                btTinhThanhDK.Text = "";
                btQuanHuyenDK.Text = "";
                btPhuongXaDK.Text = "";
            }

            if (tttv.TinhTrangCuTru == (int)TamTruTamVang.enTTTV.TamTru)
                btTTCTDK.Text = "Tạm trú";
            else
                btTTCTDK.Text = "Tạm vắng";
        }

        private void printDocument1_PrintPage(object sender, System.Drawing.Printing.PrintPageEventArgs e)
        {
            e.Graphics.DrawImage(bitmap, 0, 0);
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            btIn.Visible = false;
            TaoManHinhIn();
            btIn.Visible = true;
            DialogResult result = printDialog1.ShowDialog();
            if (result == DialogResult.OK)
                printPreviewDialog1.ShowDialog();
        }

        private void fGiayTamTruTamVang_Load(object sender, EventArgs e)
        {
            if (tttv.TinhTrangCuTru == (int)TamTruTamVang.enTTTV.TamVang)
            {
                lbTitle.Text = "ĐƠN XÁC NHẬN TẠM VẮNG";
                this.Text = "Đơn xác nhận tạm vắng";
            }
            LoadThongTin();
        }
    }
}
