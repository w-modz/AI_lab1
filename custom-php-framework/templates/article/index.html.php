<?php

/** @var \App\Model\Article[] $articles */
/** @var \App\Service\Router $router */

$title = 'Article List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Articles List</h1>

    <a href="<?= $router->generatePath('article-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($articles as $article): ?>
            <li><h3><?= $article->getTitle() ?></h3>
                <p><strong>Author:</strong> <?= $article->getAuthor() ?></p>
                <p><strong>Published:</strong> <?= $article->getPublicationDate() ?></p>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('article-show', ['id' => $article->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('article-edit', ['id' => $article->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';