<?php
namespace App\Model;

use App\Service\Config;

class Article
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $content = null;
    private ?string $author = null;
    private ?string $publication_date = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Article
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Article
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Article
    {
        $this->content = $content;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Article
    {
        $this->author = $author;

        return $this;
    }

    public function getPublicationDate(): ?string
    {
        return $this->publication_date;
    }

    public function setPublicationDate(?string $publication_date): Article
    {
        $this->publication_date = $publication_date;

        return $this;
    }

    public static function fromArray($array): Article
    {
        $article = new self();
        $article->fill($array);

        return $article;
    }

    public function fill($array): Article
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['publication_date'])) {
            $this->setPublicationDate($array['publication_date']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM article ORDER BY publication_date DESC';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $articles = [];
        $articlesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($articlesArray as $articleArray) {
            $articles[] = self::fromArray($articleArray);
        }

        return $articles;
    }

    public static function find($id): ?Article
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM article WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $articleArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $articleArray) {
            return null;
        }
        $article = Article::fromArray($articleArray);

        return $article;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO article (title, content, author, publication_date) VALUES (:title, :content, :author, :publication_date)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'content' => $this->getContent(),
                'author' => $this->getAuthor(),
                'publication_date' => $this->getPublicationDate() ?: date('Y-m-d H:i:s'),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE article SET title = :title, content = :content, author = :author, publication_date = :publication_date WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':content' => $this->getContent(),
                ':author' => $this->getAuthor(),
                ':publication_date' => $this->getPublicationDate(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM article WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setContent(null);
        $this->setAuthor(null);
        $this->setPublicationDate(null);
    }
}