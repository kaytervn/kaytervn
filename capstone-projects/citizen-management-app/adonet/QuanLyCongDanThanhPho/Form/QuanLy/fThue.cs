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
    public partial class fThue : Form
    {
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        ThueDAO tDAO = new ThueDAO();
        CongDanDAO cdDAO = new CongDanDAO();

        public fThue()
        {
            InitializeComponent();
        }

        private void fThue_Load(object sender, EventArgs e)
        {
            cbCCCD.DataSource = cccdDAO.LayDanhSach();
            cbCCCD.ValueMember = "CCCD";
            cbCCCD.Text = "";

            cbLoai.Text = "Tất cả";
        }

        void CapNhatCellError()
        {
            for (int i = 0; i < dtgvThue.Rows.Count; i++)
            {
                DateTime dt;
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(dtgvThue.Rows[i].Cells[3].Value.ToString());

                DateTime.TryParse(dtgvThue.Rows[i].Cells[7].Value.ToString(), out dt);
                if (dt.AddDays(30).Date < DateTime.Today.Date)
                    dtgvThue.Rows[i].Cells[7].ErrorText = "Tiền thuế đã quá hạn kể từ ngày khai mã số thuế!";
                if (cccd.CongDan.TinhTrang == (int)CongDan.enCD.QuaDoi)
                    dtgvThue.Rows[i].Cells[3].ErrorText = "Công dân đã qua đời!";
            }
        }

        void ReloadData()
        {
            if (cbLoai.Text == "Tất cả")
                dtgvThue.DataSource = tDAO.LayDanhSach();
            else if (cbLoai.Text == "Còn hạn")
                dtgvThue.DataSource = tDAO.LayDanhSach_ConHan();
            else
                dtgvThue.DataSource = tDAO.LayDanhSach_QuaHan();

            CapNhatCellError();
        }

        void LoadThongTin_CaNhan(CongDan cd)
        {
            tbMaCD.Text = cd.MaCD.ToString();
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nu)
                rbNu.Checked = true;
            else
                rbNam.Checked = true;

            tbNgheNghiep.Text = cd.NgheNghiep;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            tbSoDu.Text = cd.SoDu.ToString();
        }

        void ResetThongTin_CaNhan()
        {
            tbMaCD.Text = "";
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            tbNgheNghiep.Text = "";
            rbConSong.Checked = true;
            tbSoDu.Text = "";
        }

        void ResetThongTinRong()
        {
            cbCCCD.Text = "";
            tbMucThue.Text = "";
            tbThuNhap.Text = "";
            tbTenThue.Text = "";
            dtpkNgay.Value = DateTime.Today;
        }

        void TinhTienThue()
        {
            try
            {
                btTienThue.Text = (Convert.ToDouble(tbThuNhap.Text) * Convert.ToDouble(tbMucThue.Text) / 100).ToString();
            }
            catch
            {
                btTienThue.Text = "0";
            }
        }

        private void cbCCCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(cbCCCD.Text);
                if (cccd != null)
                    LoadThongTin_CaNhan(cccd.CongDan);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin_CaNhan();
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            if (cbLoai.Text == "Tất cả")
                dtgvThue.DataSource = tDAO.TimKiem(tbTimKiem.Text);
            else if (cbLoai.Text == "Còn hạn")
                dtgvThue.DataSource = tDAO.TimKiem_ConHan(tbTimKiem.Text);
            else
                dtgvThue.DataSource = tDAO.TimKiem_QuaHan(tbTimKiem.Text);

            CapNhatCellError();
        }

        private void cbLoai_TextChanged(object sender, EventArgs e)
        {
            ReloadData();
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                Thue t = new Thue(Convert.ToInt32(tbMaThue.Text), tbTenThue.Text, Convert.ToDouble(tbMucThue.Text), cbCCCD.Text, Convert.ToDouble(tbThuNhap.Text), dtpkNgay.Value);

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    tDAO.Xoa(t);
                    ReloadData();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btSua_Click(object sender, EventArgs e)
        {
            try
            {
                Thue t = new Thue(Convert.ToInt32(tbMaThue.Text), tbTenThue.Text, Convert.ToDouble(tbMucThue.Text), cbCCCD.Text, Convert.ToDouble(tbThuNhap.Text), dtpkNgay.Value);
               
                if (t.TenThue == "" || tbMucThue.Text == "" || tbThuNhap.Text == "")
                {
                    MessageBox.Show("Thông tin khai thuế không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    tDAO.Sua(t);
                    ReloadData();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                Thue t = new Thue(0, tbTenThue.Text, Convert.ToDouble(tbMucThue.Text), cbCCCD.Text, Convert.ToDouble(tbThuNhap.Text), DateTime.Today);
                
                if (t.TenThue == "" || tbMucThue.Text == "" || tbThuNhap.Text == "")
                {
                    MessageBox.Show("Thông tin khai thuế không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    tDAO.Them(t);
                    ReloadData();
                    ResetThongTinRong();
                }    
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btThanhToan_Click(object sender, EventArgs e)
        {
            try
            {
                Thue t = tDAO.LayThongTinThueBangMaThue(Convert.ToInt32(tbMaThue.Text));

                if (t.CanCuocCongDan.CongDan.SoDu < Convert.ToDouble(btTienThue.Text))
                {
                    DialogResult dialogResult = MessageBox.Show(
                        "Số dư trong tài khoản không đủ để thực hiện giao dịch này!\n" +
                        "Nếu thực hiện giao dịch thì số dư có thể bị âm. Bạn có chắc chắn muốn thực hiện không?", "Thông báo",
                        MessageBoxButtons.YesNo, MessageBoxIcon.Question
                    );
                    if (dialogResult == DialogResult.Yes)
                    {
                        t.Ngay = t.Ngay.AddDays(30);
                        tDAO.Sua(t);

                        t.CanCuocCongDan.CongDan.SoDu -= Convert.ToDouble(btTienThue.Text);
                        cdDAO.Sua(t.CanCuocCongDan.CongDan);

                        ReloadData();
                        ResetThongTinRong();
                    }
                }
                else
                {
                    t.Ngay = t.Ngay.AddDays(30);
                    tDAO.Sua(t);

                    t.CanCuocCongDan.CongDan.SoDu -= Convert.ToDouble(btTienThue.Text);
                    cdDAO.Sua(t.CanCuocCongDan.CongDan);

                    ReloadData();
                    ResetThongTinRong();
                }    
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thanh toán thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void dtgvThue_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvThue.CurrentRow.Selected = true;
            tbMaThue.Text = dtgvThue.SelectedRows[0].Cells[0].Value.ToString();
            tbTenThue.Text = dtgvThue.SelectedRows[0].Cells[1].Value.ToString();
            tbMucThue.Text = dtgvThue.SelectedRows[0].Cells[2].Value.ToString();
            cbCCCD.Text = dtgvThue.SelectedRows[0].Cells[3].Value.ToString();
            tbThuNhap.Text = dtgvThue.SelectedRows[0].Cells[6].Value.ToString();
            dtpkNgay.Value = (DateTime)dtgvThue.SelectedRows[0].Cells[7].Value;
        }

        private void tbMucThue_TextChanged(object sender, EventArgs e)
        {
            TinhTienThue();
        }

        private void tbThuNhap_TextChanged(object sender, EventArgs e)
        {
            TinhTienThue();
        }
    }
}
