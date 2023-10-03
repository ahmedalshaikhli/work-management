using System;
using System.IO;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly IConfiguration _config;

        public PhotoService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<Photo> SaveToDiskAsync(IFormFile file)
        {
            var photo = new Photo();
            if (file.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine("Content/images/products", fileName);
                await using var fileStream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(fileStream);

                photo.FileName = fileName;
                photo.PictureUrl = _config["ApiUrl"] + "images/products/" +  fileName;

                return photo;
            }

            return null;
        }

        public void DeleteFromDisk(Photo photo)
        {
            var filePath = Path.Combine("Content/images/products", photo.FileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}