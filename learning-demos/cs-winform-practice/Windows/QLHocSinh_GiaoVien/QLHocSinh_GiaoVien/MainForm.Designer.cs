namespace QLHocSinh_GiaoVien
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.btnHS = new System.Windows.Forms.Button();
            this.btnGV = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnHS
            // 
            this.btnHS.BackColor = System.Drawing.Color.PaleGreen;
            this.btnHS.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnHS.Font = new System.Drawing.Font("SVN-Caprica Script", 20.25F);
            this.btnHS.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.btnHS.Location = new System.Drawing.Point(55, 350);
            this.btnHS.Name = "btnHS";
            this.btnHS.Size = new System.Drawing.Size(148, 97);
            this.btnHS.TabIndex = 0;
            this.btnHS.Text = "Quản lý\r\nhọc sinh";
            this.btnHS.UseVisualStyleBackColor = false;
            this.btnHS.Click += new System.EventHandler(this.button1_Click);
            // 
            // btnGV
            // 
            this.btnGV.BackColor = System.Drawing.Color.PaleTurquoise;
            this.btnGV.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnGV.Font = new System.Drawing.Font("SVN-Caprica Script", 20.25F);
            this.btnGV.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.btnGV.Location = new System.Drawing.Point(285, 350);
            this.btnGV.Name = "btnGV";
            this.btnGV.Size = new System.Drawing.Size(148, 97);
            this.btnGV.TabIndex = 0;
            this.btnGV.Text = "Quản lý\r\ngiáo viên";
            this.btnGV.UseVisualStyleBackColor = false;
            this.btnGV.CursorChanged += new System.EventHandler(this.btnGV_CursorChanged);
            this.btnGV.Click += new System.EventHandler(this.btnGV_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.Transparent;
            this.label1.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.label1.Font = new System.Drawing.Font("SVN-Caprica Script", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.label1.Location = new System.Drawing.Point(70, 35);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(354, 76);
            this.label1.TabIndex = 1;
            this.label1.Text = "School App";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // button1
            // 
            this.button1.BackColor = System.Drawing.Color.Salmon;
            this.button1.Location = new System.Drawing.Point(465, 5);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(27, 23);
            this.button1.TabIndex = 31;
            this.button1.Text = "X";
            this.button1.UseVisualStyleBackColor = false;
            this.button1.Click += new System.EventHandler(this.button1_Click_1);
            // 
            // button2
            // 
            this.button2.BackColor = System.Drawing.Color.LightSkyBlue;
            this.button2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button2.Location = new System.Drawing.Point(432, 5);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(27, 23);
            this.button2.TabIndex = 31;
            this.button2.Text = "--";
            this.button2.UseVisualStyleBackColor = false;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::QLHocSinh_GiaoVien.Properties.Resources._46304;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(497, 498);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnGV);
            this.Controls.Add(this.btnHS);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "School App";
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnHS;
        private System.Windows.Forms.Button btnGV;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
    }
}