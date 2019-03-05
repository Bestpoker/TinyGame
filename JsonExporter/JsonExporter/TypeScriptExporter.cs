using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JsonExporter
{
    public class TypeScriptExporter
    {
        public static void Export(string path)
        {
            DirectoryInfo dir = new DirectoryInfo(path);
            if (!dir.Exists)
            {
                Console.WriteLine("导出失败，未找到路径");
                return;
            }

            string exportPath = path + "/TypeScipt";
            if (!Directory.Exists(exportPath))
            {
                Directory.CreateDirectory(exportPath);
            }

            var files = dir.GetFiles("*.xlsx");
            for (int i = 0; i < files.Length; i++)
            {
                Console.WriteLine("开始导出：" + files[i].Name);
                using (FileStream fs = files[i].OpenRead())
                {
                    List<string> proName = new List<string>();
                    List<string> proType = new List<string>();
                    List<string> proValue = new List<string>();

                    IWorkbook workbook = null;

                    string extensionName = "";
                    // 2007版本
                    if (files[i].Name.EndsWith(".xlsx"))
                    {
                        extensionName = ".xlsx";
                        workbook = new XSSFWorkbook(fs);
                    }
                    // 2003版本
                    else if (files[i].Name.EndsWith(".xls"))
                    {
                        extensionName = ".xls";
                        workbook = new HSSFWorkbook(fs);
                    }

                    var sheet = workbook.GetSheetAt(0);
                    if (sheet != null)
                    {
                        if (sheet.PhysicalNumberOfRows > 2)
                        {
                            for (int k = 0; k < sheet.PhysicalNumberOfRows; k++)
                            {
                                var row = sheet.GetRow(k);
                                if (k == 0)
                                {
                                    for (int l = 0; l < row.Cells.Count; l++)
                                    {
                                        proName.Add(row.Cells[l].ToString());
                                    }
                                }
                                else if (k == 1)
                                {
                                    for (int l = 0; l < row.Cells.Count; l++)
                                    {
                                        proType.Add(row.Cells[l].ToString());
                                    }
                                }
                                else
                                {
                                    for (int l = 0; l < row.Cells.Count; l++)
                                    {
                                        if (proType[l] == "string")
                                        {
                                            proValue.Add($"\"{row.Cells[l].ToString()}\"");
                                        }
                                        else
                                        {
                                            proValue.Add(row.Cells[l].ToString());
                                        }
                                        
                                    }
                                }
                            }

                            using (StreamWriter sw = new StreamWriter(exportPath + "/" + files[i].Name.Replace(extensionName, ".ts")))
                            {
                                string fileName = files[i].Name.Replace(extensionName, "");
                                sw.WriteLine($"export class {fileName} {{");
                                sw.WriteLine();
                                for (int k = 0; k < proName.Count; k++)
                                {
                                    sw.WriteLine($"  {proName[k]}: {proType[k]};");
                                }
                                sw.WriteLine();

                                sw.WriteLine($" static {fileName}Map: {{ [{proName[0]}: {proType[0]}]: {fileName}; }} = {{");

                                for (int k = 0; k < sheet.PhysicalNumberOfRows - 2; k++)
                                {
                                    sw.WriteLine($"     {proValue[k * proName.Count]}: {{ ");
                                    
                                    for (int l = 0; l < proName.Count; l++)
                                    {
                                        sw.WriteLine($"         {proName[l]}: {proValue[proName.Count * k + l]},");
                                    }

                                    sw.WriteLine($"     }},");
                                }

                                sw.WriteLine("  };");

                                sw.WriteLine();
                                sw.WriteLine("}");
                            }

                        }
                    }
                    
                }
                    
                
            }
        }
    }
}
