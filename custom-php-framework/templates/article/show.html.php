<?php

/** @var \App\Model\Article $article */
/** @var \App\Service\Router $router */

$title = "{$article->getTitle()} ({$article->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $article->getTitle() ?></h1>
    <div class="article-meta">
        <p><strong>Author:</strong> <?= $article->getAuthor() ?></p>
        <p><strong>Published:</strong> <?= $article->getPublicationDate() ?></p>
    </div>
    <article>
        <?= nl2br($article->getContent()); ?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('article-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('article-edit', ['id'=> $article->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';