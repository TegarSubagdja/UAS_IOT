import cv2
import numpy as np
import requests
import time

def read_image_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  
        img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return img
    except requests.exceptions.RequestException as e:
        print(f"Error reading image from URL: {e}")
        print(f"Response from server: {response.text}")  # Tampilkan response dari server
        return None

def main():
    url = "https://roomradar.000webhostapp.com/api/img/image.jpg"  

    while True:
        frame = read_image_from_url(url)

        if frame is not None:
            print("Gambar berhasil diterima")
            time.sleep(0.5)
        else:
            print("Gagal mengambil gambar. Menunggu 3 detik sebelum mencoba lagi.")
            time.sleep(3)

if __name__ == "__main__":
    main()
