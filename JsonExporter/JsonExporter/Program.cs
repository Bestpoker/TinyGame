using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JsonExporter
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                if (args.Length > 0)
                {
                    Console.WriteLine("开始导出，路径：" + args[0]);
                    TypeScriptExporter.Export(args[0]);
                }
                else
                {
                    Console.WriteLine("开始导出，默认路径：./Excel");
                    TypeScriptExporter.Export("./Excel");
                }
                Console.WriteLine("导出完毕，按任意键结束");
                Console.ReadKey();
            }
            catch (Exception e)
            {
                Console.WriteLine("导出失败，意外错误：" + e);
                Console.ReadKey();
            }
            
            
        }
    }
}
