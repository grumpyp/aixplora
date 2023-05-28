from typing import BinaryIO
from fastapi import UploadFile

import xlrd
import csv
import os


def load_xls(file: BinaryIO, filename: str, file_meta: UploadFile):

    misc_dir = os.path.join(os.getcwd(), "misc")
    workbook = xlrd.open_workbook(file_contents=file.read())

    output_file_path = f"{misc_dir}/{filename}.txt"
    with open(output_file_path, "w") as csvfile:
        writer = csv.writer(csvfile)

        # Iterate over all worksheets
        for sheet_name in workbook.sheet_names():
            worksheet = workbook.sheet_by_name(sheet_name)

            for row_num in range(worksheet.nrows):
                row = worksheet.row_values(row_num)
                # replace newline if possible
                row = [str(cell).strip().replace("\n", "") for cell in row if cell is not None]
                writer.writerow(row)

    return output_file_path, file_meta