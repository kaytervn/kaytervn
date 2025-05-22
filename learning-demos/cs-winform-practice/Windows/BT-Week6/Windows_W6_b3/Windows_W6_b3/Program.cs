using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Windows_W6_b3
{
    internal class Blog
    {
        public int id { get; set; }
        public string name { get; set; }
        public virtual List<string> tags { get; set; }
    }

    internal class Post
    {
        public int id { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public int blogId { get; set; }
    }

    internal class BloggingContext: DbContext
    {
        public DbSet<Blog> blogs { get; set; }
        public DbSet<Post> posts { get; set; }

    }

    internal class Program
    {
        static void Main(string[] args)
        {
            using (var db = new BloggingContext())
            {
                var blog = new Blog
                {
                    id = 1,
                    name = "abc"
                };
                db.blogs.Add(blog);
                db.SaveChanges();

                var query = from q in db.blogs select q;

                foreach (var item in query)
                {
                    Console.WriteLine(item.id);
                }
            }
        }
    }
}
