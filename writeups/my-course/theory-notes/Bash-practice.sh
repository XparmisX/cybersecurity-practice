pwd
ls
ls -ahl
cd dir_name
mkdir dir_name

touch myfile
cat myfile
file myfile
wc myfile

cp source destination
cp -r source destination
mv source destination
rm myfile
rm -r dir_name

whoami
id
echo $SHELL
uname
uname -a

echo "Hello, World!" > var/www/uploads/hello.txt

cat myfile.txt | grep "Hello, World!" | wc -l

echo "First command"; echo "Second command"

ping quera.org & ping juniora.org

ping quera.org -c 10 && echo "Command finished successfully!"

touch `whoami`.txt
cat $(whoami).txt
