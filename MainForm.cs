using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

namespace Fortify;

public sealed class MainForm : Form
{
    private readonly WebView2 _webView;

    public MainForm()
    {
        Text = "Fortify Mods";
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(18, 18, 18);
        ForeColor = Color.White;
        ClientSize = new Size(1400, 900);

        _webView = new WebView2
        {
            Dock = DockStyle.Fill,
        };

        Controls.Add(_webView);
        Load += MainForm_Load;
    }

    private async void MainForm_Load(object? sender, EventArgs e)
    {
        await _webView.EnsureCoreWebView2Async();

        var appRoot = AppContext.BaseDirectory;
        var indexPath = Path.Combine(appRoot, "index.html");
        if (File.Exists(indexPath))
        {
            _webView.Source = new Uri(indexPath);
        }
    }
}
