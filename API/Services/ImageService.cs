using System;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using API.RequestHelpers;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class ImageService
    {
        /* Stores a Cloudinary client instance
         * Keeps it private (encapsulation)
         * Prevents modification after construction (immutability)
         * Follows naming conventions (underscore prefix)
         */
        private readonly Cloudinary _cloudinary;

        /* Constructor initializes the Cloudinary client instance */
        public ImageService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        /*
         * Adds an image to Cloudinary
         * Returns an <ImageUploadResult>
         */
        public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {

                /*
                * Open the file stream
                * returns a Stream object containing the file's binary data
                */

                using var stream = file.OpenReadStream();

                // Create upload parameters
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "re-course"
                };

                // Upload the image to Cloudinary
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            // Return the upload result, which contains the image's public ID and URL
            return uploadResult;
        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result;
        }
    }
}
