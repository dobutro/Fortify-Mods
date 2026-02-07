using System.Drawing;
using System.Windows.Forms;

namespace Fortify;

public sealed class MainForm : Form
{
    public MainForm()
    {
        Text = "Fortify Mods";
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(18, 18, 18);
        ForeColor = Color.White;
        ClientSize = new Size(1400, 900);

        var label = new Label
        {
            Text = "Fortify Mods — WinForms оболочка. UI будет подключён позже.",
            AutoSize = true,
            ForeColor = Color.Gainsboro,
            Location = new Point(24, 24),
        };

        Controls.Add(label);
    }
}
