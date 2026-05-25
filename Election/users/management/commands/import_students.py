import csv
from django.core.management.base import BaseCommand
from users.models import Student


class Command(BaseCommand):
    help = "Import students from CSV"

    def handle(self, *args, **kwargs):

        file_path = "students.csv"

        with open(file_path, newline='') as file:
            reader = csv.DictReader(file)

            for row in reader:
                Student.objects.get_or_create(
                    roll_no=row["roll_no"],
                    defaults={
                        "name": row["name"],
                        "email": row["email"],
                        "department": row["department"]
                    }
                )

        self.stdout.write(self.style.SUCCESS("Students imported successfully"))